---
templateKey: blog-post
title: Secure computing services - What are they?
date: 2021-04-26T19:19:31.800Z
description: What are secure computing services and why they are useful.
featuredpost: true
featuredimage: /img/secure-compute.png
tags:
  - aws
  - azure
  - computing
---

## Introduction to secure computing

Secure computing is the act of executing code in a trusted execution environments (TEEs) allowing increase security of code executed as the environment has to be trusted. In this post we will cover two popular secure computing services. Highlighting some pros and cons of each and provide you with a overview on why you might want to consider secure computing.

## Attestation

The feature that allows the below services to be TEEs is attestation.
This means that the environment executing the code has verified its identity in some way.

For example with nitro enclaves you provide a attestation document with your request to KMS this can be then used to allow only the enclave permission to decrypt records by limiting the KMS key policy to be restricted to the measurements of your attested enclave

## Secure computing services

### AWS Nitro Enclaves

I have first hand experience using nitro enclaves, the experience has been challenging but rewarding to know that the solution we have provided our client will be super secure for them.

#### Pros

- No extra cost for using a ec2 with nitro.
- Runs a full isolated VM along side your ec2 with its own kernel, CPU and memory.

#### Cons

- [AWS SDK (boto3) doesn't support attestation](https://github.com/boto/botocore/issues/2271) (Have to call the KMS API direct look out for a post on this on the future!).
- Still very new limited documentation and guides online.

### Azure Confidential compute

### Pros

- [Confidential containers](https://docs.microsoft.com/en-us/azure/confidential-computing/confidential-nodes-aks-overview) Can be implemented with AKS (Azure Kubernetes Service)

- More mature product with its own [Open Enclave SDK](https://openenclave.io/sdk/).

### Cons

- Unlike nitro enclaves it doesn't run as a full VM and requires software components to be developed using C/C++ to use the [Open Enclave SDK](https://openenclave.io/sdk/).

## Use cases

### Password storage

A common use case i see for secure computing is creating super secure password storage mechanism, lots of applications store passwords and there is a lot of room for error and creating vulnerabilities. Offloading the task to a trusted environment will help mitigate this risk as passwords can only been accessed in the secured environment.

### Blockchain

Blockchain nodes are run and maintained by operators or validators who wish to ensure integrity and reach consensus on the state of the network. The nodes themselves are replicas and are used to track blockchain transactions. Each node has a full copy of the transaction history, ensuring integrity and availability in a distributed network. Blockchain technologies built on top of confidential computing can use hardware-based privacy to enable data confidentiality and secure computations

## Conclusion
