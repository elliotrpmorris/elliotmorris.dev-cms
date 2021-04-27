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

![secure compute](/img/secure-compute.png)

## Attestation

The feature that allows the below services to be TEEs is attestation.
This means that the environment executing the code has verified its identity in some way.

For example with nitro enclaves you provide a attestation document with your request to KMS this can be then used to allow only the enclave permission to decrypt records by limiting the KMS key policy to be restricted to the measurements of your attested enclave

## Secure computing services

### AWS Nitro Enclaves

I have first hand experience using nitro enclaves, the experience has been challenging but rewarding to know that the solution we have provided our client will be super secure for them. 

You can read more about my first hand experience in my blog post about [Nitro Enclaves](https://elliotmorris.dev/blog/2021-01-16-aws-nitro-enclave/). 

#### Pros

- No extra cost for using a EC2 with nitro.
- Runs a full isolated VM along side your EC2 with its own kernel, CPU and memory.

#### Cons

If you would like to learn more on Nitro Enclaves checkout the docs [here](https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html).

- [AWS SDK (boto3) doesn't support attestation](https://github.com/boto/botocore/issues/2271) (Have to call the KMS API direct look out for a post on this on the future!).
- Still very new limited documentation and guides online.

### Azure Confidential Compute

### Pros

- [Confidential containers](https://docs.microsoft.com/en-us/azure/confidential-computing/confidential-nodes-aks-overview) Can be implemented with AKS (Azure Kubernetes Service)

- More mature product with its own [Open Enclave SDK](https://openenclave.io/sdk/).

### Cons

- Unlike nitro enclaves it doesn't run as a full VM and requires software components to be developed using C/C++ to use the [Open Enclave SDK](https://openenclave.io/sdk/).

If you would like to learn more on Confidential Compute checkout the docs [here](https://docs.microsoft.com/en-us/azure/confidential-computing/).

## Use cases

### Password storage

A common use case i see for secure computing is creating super secure password storage mechanism, lots of applications store passwords and there is a lot of room for error and creating vulnerabilities. Offloading the task to a trusted environment will help mitigate this risk as passwords can only been accessed in the secured environment.

### Blockchain

Blockchain nodes are run and maintained by operators or validators who wish to ensure integrity and reach consensus on the state of the network. The nodes themselves are replicas and are used to track blockchain transactions. Each node has a full copy of the transaction history, ensuring integrity and availability in a distributed network. Blockchain technologies built on top of confidential computing can use hardware-based privacy to enable data confidentiality and secure computations.

### Financial 

Banks and financial businesses alike deal with a lot of sensitive information, such as card details which is something you want to keep away from a potential attacker at all costs. Storing this data encrypted and only accessible from with in a TEE will mitigate any data breaches. 

### Health care

Health care companies deal with lots of sensitive patient data which can be processed from within a TEE, this allows isolation of sensitive documents and data is only processed from within a TEE. This is where my personal experience lies with using TEE's as we have been signing prescriptions securely from within a TEE.

## Conclusion

In time to come as these products become more mature and people reap the benefits of extended security, the eco system for these products will grow and could become a real game changer mostly for how passwords are handled. As more restrictions for attackers will put people of even trying to break into them. 