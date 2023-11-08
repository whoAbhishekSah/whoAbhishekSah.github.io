---
title: 'Reducing cAdvisor metrics cardinality'
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

The above should look familiar if you have experience configuring Prometheus. OTEL collector can be used as a drop-in replacement for Prometheus for scraping with some added benefits - like [env variable support](https://opentelemetry.io/docs/collector/configuration/#configuration-environment-variables). We are scraping cAdvisor target by doing Kubernetes Node Service discovery. The `kubernetes_sd_configs` retrievs scrape targets from Kubernetes REST API. The `role: node` discovers one target per cluster node with the address defaulting to the Kubelet's HTTP port. Here we are explicitly setting the address(host and port) and path of the scrape target. The hostname here points to API Server. 

> The API server's in-cluster address is also published to a Service named kubernetes in the default namespace so that pods may reference kubernetes.default.svc as a DNS name for the local API server.


Pods running in the cluster can access it via  Since the API is protected, only authorized requests can access the data, hence we need to set the bearer token.

An equivalent curl request would be:

```sh
curl -k -H "Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)"  [https://kubernetes.default.svc.cluster.local:443/api/v1/nodes/ip-10-1-81-147.us-east-2.compute.internal/proxy/metrics/cadvisor](https://kubernetes.default.svc.cluster.local/api/v1/nodes/ip-10-1-4-5.us-west-1.compute.internal/proxy/metrics/cadvisor)
```



