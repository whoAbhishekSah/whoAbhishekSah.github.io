---
title: 'cAdvisor and high cardinality'
date: '2023-11-08T22:12:03.284Z'
description: 'prometheus cardinality'
---

cAdvisor is a very popular utility that provides resource usage and performance characteristics of running containers. It collects, aggregates and exports metrics about running containers. It comes integrated with the Kubelet binary inside Kubernetes clusters. The metrics can be collected at from kubelet API Endpoint `/metrics/cadvisor`. These metrics are represented in Prometehus Exposition format.

Here is an example metric, fir CPU Utilisation:

```
# HELP container_cpu_system_seconds_total Cumulative system cpu time consumed in seconds.
# TYPE container_cpu_system_seconds_total counter
container_cpu_system_seconds_total{container="",id="/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod05b3ee07_a2bd_47e7_9599_7961201f20dd.slice",image="",name="",namespace="test",pod="test-workload-7756958c5b-qtkgc"} 22.65 1699453605805
```

Since cAdvisor or Kubelet doesn't store these metrics, one can not query historical data which means users should periodically scrape these metrics and store in some observability server like Prometheus or Grafana Mimir etc. cAdvisor metrics can be very useful to look at the resource consumption of your workload to achieve optimal resource utilization, debug issues with containers and usage trends.

## Scraping cAdvisor

Since there is one cAdvisor instance running per node, we will need to scrape all of them to get complete picture of the resource utilisation. At Pixxel, we deploy Open Telemetry collectors as Daemonset, to get this job done. That means, each node will have one OTEL collector pod scraping the cAdvisor metrics(along with other endpoints).

The following snippet describe how you can scrape cAdvisor metrics using OTEL pods:

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: cadvisor
          scheme: https
          tls_config:
            ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
            insecure_skip_verify: true
          bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
          kubernetes_sd_configs:
            - role: node
          relabel_configs:
            - action: labelmap
              regex: __meta_kubernetes_node_label_(.+)
            - target_label: __address__
              replacement: kubernetes.default.svc.cluster.local:443
            - source_labels: [__meta_kubernetes_node_name]
              regex: (.+)
              target_label: __metrics_path__
              replacement: /api/v1/nodes/$$${1}/proxy/metrics/cadvisor
```

The above should look familiar if you have experience configuring Prometheus. OTEL collector can be used as a drop-in replacement for Prometheus for scraping with some added benefits - like [env variable support](https://opentelemetry.io/docs/collector/configuration/#configuration-environment-variables). We are scraping cAdvisor target by doing Kubernetes Node Service discovery. The `kubernetes_sd_configs` retrievs scrape targets from Kubernetes REST API. The `role: node` discovers one target per cluster node with the address defaulting to the Kubelet's HTTP port. We are explicitly setting the address(host and port) and path of the scrape target to local API Server. I'll quote K8s documentation on how this address is formed:

> The API server's in-cluster address is also published to a Service named kubernetes in the default namespace so that pods may reference kubernetes.default.svc as a DNS name for the local API server.

Pods running in the cluster should authenticate with API server with service account credentials.

An equivalent curl request would be:

```sh
curl -k -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)"  [https://kubernetes.default.svc.cluster.local:443/api/v1/nodes/ip-10-1-81-147.us-east-2.compute.internal/proxy/metrics/cadvisor](https://kubernetes.default.svc.cluster.local/api/v1/nodes/ip-10-1-4-5.us-west-1.compute.internal/proxy/metrics/cadvisor)
```

PS: Kubernetes also provides a handy kubectl command to access API Server, using which we can query cAdvisor metrics:

```
kubectl get --raw /api/v1/nodes/ip-10-1-4-5.us-west-1.compute.internal/proxy/metrics/cadvisor
```

## Metrics Cardinality

The metrics prepared by cAdvisor sometimes exceeds the label limit set by observability server. For example, in Grafana Mimir we see the max label for any series set to 30 (by default) via config option: `max_label_names_per_series` [ref](https://grafana.com/docs/mimir/latest/references/configuration-parameters/#limits)

When I observed OTEL Collector logs after few hours of cAdvisor scrape setup, I found multiple series were getting rejected by Mimir server because they higher number of labels than acceptable limit. Some had 32 and 35.

I wanted to take a look into what all labels were getting published in cAdvisor. For `container_oom_events_total` metric we sae the follwing labels:

```
beta_kubernetes_io_arch
beta_kubernetes_io_instance_type
beta_kubernetes_io_os
eks_amazonaws_com_capacityType
eks_amazonaws_com_nodegroup
eks_amazonaws_com_nodegroup_image
eks_amazonaws_com_sourceLaunchTemplateld
eks_amazonaws_com_sourceLaunchTemplateVersion
failure_domain_beta_kubernetes_io_region
failure_domain_beta_kubernetes_io_zone
id
k8s_io_cloud_provider_aws
kubernetes_io_arch
kubernetes_io_hostname
kubernetes_io_os
node_kubernetes_io_instance_type
topology_ebs_csi_aws_com_zone
topology_kubernetes_io_region
topology_kubernetes_io_zone
```

These 20 labels were being added in every series in addition to the global demographic labels such as cluster name, AWS account etc. In some metrics this count reached 25 or so. We quickly concluded not all of these are required - so instead of changing server limits we could very well delete these labels without harming anything.

Luckily prometheus provides a way to rewrite labelset. This can be achieved via `metric_relabel_config`. We decide to drop all `eks_` prefixed labels.

The way to do that is:

```yaml
relabel_configs:
  ...
  ...

metric_relabel_configs:
  - action: labeldrop
    regex: 'eks.*'
```

This change brought down the label count to acceptable limits. Practically we may not need even the `topology_` prefixed labels. But we did the least amount of label rewriting to get the system running. If needed in future, we can look into further reducing the labelset using the same approach.


#### References:

- [Metric Relabeling](https://grafana.com/blog/2022/03/21/how-relabeling-in-prometheus-works/)
