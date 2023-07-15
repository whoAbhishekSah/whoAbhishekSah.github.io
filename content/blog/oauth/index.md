---
title: 'Google IAP Auth automation'
date: '2023-07-14T22:14:03.284Z'
description: 'STORY'
---

This blog takes inspiration from a significant automation project I undertook at Gojek in 2021. It has been pending publication for a while, mainly due to my lack of diligence. However, I have now resolved to be more active in blogging, starting with the unpublished drafts I have accumulated. Without further ado, let's dive into it.

## Automating Google IAP Auth for Golang applications

At Gojek, various internal applications for Developers uses Google SSO. The Data Platform team also uses Google Authorization Server as the identity provider to identify the developer and enforce proper ACL. We use [Google IAP](https://cloud.google.com/iap) to guard access to our applications.

Google IAP is widely used to control access to web based application running on browsers. The same applications had a CLI based client, where one can perform similar action using command line. Think of it like Google cloud console and `gcloud` CLI utility.

We wanted to enable our developers to perform the same actions using the CLI applications. The challenge was to authenticate our users and service accounts.

Google IAP performs authentication of the users using Google Single Sign-On and authorizes them against Cloud IAM policies before accessing the protected resource. Before diving deep into the solution, let's see how it works behind the scene. Here we need to understand two terminologies: OAuth and OIDC.

### OAuth 2.0

OAuth 2.0 is an industry-standard for allowing applications to perform some action on behalf of a user into some other application. For example, you can securely allow a 3rd party application to access your Google contact list without giving them your Google account username and password.

Here is how a typical OAuth 2.0 Flow works. You want to allow a 3rd party application (let's call it 3PA, from hereon) to access your Google contacts list. The sequence of steps that happens under OAuth 2.0 flow is:

1. 3PA prompts you to fetch your contacts list in the browser(ex: using some button prompt.)

2. 3PA redirects your browser to the authorization server, Google in our case. In this request, 3PA will include these three things: client ID, redirect URL, scope(read-contacts).

3. The Google authorization server verifies your session or prompts you to log in (if not logged in already). Then, it shows you the consent form, asking you if you want the 3PA to access the data per the scope(read-contacts). You could choose to allow or deny.

4. If allowed by you, the Google authorization server redirects back to the 3PA(on redirect URL) with a temporary authorization code.

5. 3PA then directly calls Google authorization server with the client ID, client secret and authorization code to get an `access_token`.

6. The 3PA can use this access token as a key to access users data. Such requests get authorized by the server which owns the user's resources(contacts list).

One more thing to note here is that the authorization server issues client ID and the secret to the 3PA via a one-time registration flow. Read [this](https://developers.google.com/workspace/guides/create-credentials) to learn how to create access credentials.

### OIDC

What's missing in OAuth 2.0 protocol is that it doesn't tell 3PA about who you are and anything about you; instead, it only grants 3PA to access your data on your behalf. Enters OIDC.

OIDC is a thin layer on top of OAuth 2.0, which adds functionality around login and profile information along with what OAuth 2.0 offers. So any client using OIDC protocol can establish a login session on behalf of the user. The authorization server supporting OIDC is providing the identity, also referred to as identity-provider. Remember the SSO login screens you see on various websites?

OIDC flow is very similar to OAuth 2.0 with a slight modification.

Here is how a typical OIDC flow differs:

1. In Step 2, 3PA redirects the user to the Google Authorization server, with the client ID, secret and a specific scope "OpenID". So the authorization server knows that this will be an OIDC exchange.

2. In Step 5: The authorization server sent an `access_token` in exchange for the authorization code. With OIDC scope, the authorization server will also send one more token named `id_token`. Here, 3PA gets two tokens, `access_token` and `id_token`

The `id_token` is a JWT meaning 3PA can extract information(called claims) from it, such as name, email id, username, expiration etc.

Considering the previously mentioned sequence, we can explore the implementation of the aforementioned process in a Golang Applications.

### Solution

We found a reasonably decent open-sourced Golang OIDC client library [bwplotka/oidc](https://github.com/bwplotka/oidc) to start from. With slight modifications as per the Google IAP [contract](https://cloud.google.com/iap/docs/authentication-howto), we made this library compatible to be used by our applications.

After using the modified library embedded in our application in production, we felt this solution could help others as well. So we extracted it out as a standalone library called Casper.

This is what Casper does:

1. Casper gives you an authenticated HTTP Golang Client for applications to make requests on behalf of users and service accounts.

2. It also cares about refreshing the token when expired and cache the token in the system keyring for future needs.

**Example usage for a User authentication**

```go
import (
    casper "github.com/odpf/casper"
)

audience := "1234-xxx.apps.googleusercontent.com"

authenticatedHTTPclient, err := casper.GetAuthenticatedClient(audience)

if err != nil {
	fmt.Println("Error while getting authenticated HTTP client: ", err)
}
```

The client ID and secret can also be provided as Golang variables. If not provided, Casper falls back to ENV variables `GOOGLE_OAUTH2_CLIENT_ID` and `GOOGLE_OAUTH2_CLIENT_SECRET`

**Example usage for a Service Account**

```go
import (
    casper "source.golabs.io/asgard/casper"
)

filename := "/path/to/service/account/key.json"
audience := "1234-xxx.apps.googleusercontent.com"

authenticatedHTTPclient, err := casper.GetAuthenticatedClient(
	audience, casper.WithServiceAccountCredentials(filename),
)
if err != nil {
	fmt.Println("Error while getting authenticated HTTP client: ", err)
}
```

The service account key is used to authenticate a Service account.
Have a look at the Documentation to learn more about the usage ✌️.

### Aftermath

Casper has removed the overhead for developers to automate Google IAP Auth flow in their Golang Applications, saving their time and effort so that they can focus on the actual problem at hand.
