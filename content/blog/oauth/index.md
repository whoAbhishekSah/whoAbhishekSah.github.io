---
title: 'Google IAP Auth automation'
date: '2023-07-14T22:14:03.284Z'
description: 'STORY'
---

This blog takes inspiration from a significant automation project I undertook at Gojek in 2021. It has been pending publication for a while, mainly due to my lack of diligence. However, I have now resolved to be more active in blogging, starting with the unpublished drafts I have accumulated. Without further ado, let's dive into it.

## Automating Google IAP Auth for Golang applications

At Gojek, various internal applications for Developers uses Google SSO. The Data Platform team also uses Google Authorisation Server as the identity provider to identify the developer and enforce proper ACL. We use Google IAP to guard access to our applications.

We needed to enable our developers to perform the same actions using CLI applications with increasing scale compared to browser-enabled flow. The challenge was to authenticate our users and service accounts while using a CLI application.

Google IAP performs authentication of the users using Google Single Sign-On and authorises them against Cloud IAM policies before accessing the protected resource. Before diving deep into the solution, let's see what OAuth and OIDC are.

### OAuth 2.0

OAuth 2.0 is an industry-standard for allowing applications to perform some action on behalf of a user into some other application. For example, you can securely allow a 3rd party application to access your Google contact list without giving them your Google account username and password.

Here is how a typical OAuth 2.0 Flow works. You want to allow a 3rd party application (let's call it 3PA, from hereon) to access your Google contacts list. The sequence of steps that happens under OAuth 2.0 flow is:

1. 3PA prompts you to fetch your contacts list in the browser(via some button etc.)

2. 3PA redirects your browser to the authorisation server, Google in our case. In this request, 3PA will include these three things: client ID, redirect URL, scope(read-contacts).

3. The Google authorisation server verifies your session or prompts you to log in if not logged in. It then shows you the consent form, asking you if you want the 3PA to access the data per the scope(read-contacts). You could choose to allow or deny.

4. If allowed by you, the Google authorisation server redirects back to the 3PA(on redirect URL) with a temporary authorisation code.

5. 3PA then directly calls Google authorisation server with the client ID, client Secret and authorisation code to get an acess_token.
6. The 3PA can use this access token as a key to access users data. Such requests get authorised by the server which owns the user's resources(contacts list).

One more thing to note here is that the authorisation server issues client ID and the secret to the 3PA via a one-time registration flow.


### OIDC

What's missing in OAuth 2.0 protocol is that it doesn't tell 3PA about who you are and anything about you; instead, it only grants 3PA to access your data on your behalf. Here comes OIDC into the picture.

OIDC is a thin layer on top of OAuth 2.0, which adds functionality around log in and profile information along with what OAuth 2.0 offers. So a client using OIDC protocol can establish a login session on behalf of the user. The authorisation server supporting OIDC is providing the identity, also referred to as identity-provider. Remember the SSO login screens you see on various websites?

OIDC flow is very similar to OAuth 2.0 with a slight modification.

Here is how a typical OIDC flow differs:

1. In Step 2, 3PA redirects the user to the Google Authorisation server, with the client ID, secret and a specific scope "OpenID". So the authorisation server knows that this will be an OIDC exchange.

2. In Step 5: The authorisation server sent an access_token in exchange for the authorisation code. With OIDC scope, the authorisation server will also send one more token named id_token. 3PA gets two tokens, 1access_token` and `id_token`

The `id_token` is a JWT meaning 3PA can extract information(called claims) from id_token such as name, email id, username, expiration etc.
With the above flow in mind, we can deep dive into implementing the above flow in Golang Applications.

### Solution

We found a reasonably decent open-sourced Golang OIDC client library [bwplotka/oidc](https://github.com/bwplotka/oidc) to start from. With slight modifications as per the Google IAP [contract](https://cloud.google.com/iap/docs/authentication-howto), we made this library compatible to be used by our applications.

After using the modified library embedded in our application in production, we felt this solution could help others as well. So we extracted it out as a standalone library called Casper.

In simple words, Casper gives you an authenticated HTTP Golang Client for applications to make requests on behalf of users and service accounts. It also cares about refreshing the token when expired and cache the token in the system keyring for future needs.

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
