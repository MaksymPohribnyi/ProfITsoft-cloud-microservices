# 🎯 About The Project
## ☁️ Cloud-Native Insurance Microservices System
A microservices-based insurance policy management system designed for cloud deployment. This project demonstrates Java/Spring Boot, Node.js/NestJS, React architecture orchestrated via Kubernetes on Google Cloud Platform (GKE).

### 🔗 Related Services
This project aggregates several microservices to form a complete system:
- `gateway` — API Gateway & Security
- `front-end` — Web Application
- `rest-insurance` — Insurance Policy Service (main backend service)
- `nestjs-payments` — Payments & Transactions Service (NestJS)
- `notification-service` — Email Notification Consumer

> **Note:** The Insurance Policy services implementation resides in a separate repositories and **cloned into this repository as a folders** for convenient local development and deploy.
>
> 👇 The repositories linked below contain the **source code**, detailed service descriptions and responsibilities, REST endpoints and contracts:
> 
> **[Insurance Policy Service (Original repository)](https://github.com/MaksymPohribnyi/ProfITsoft-spring-rest)**
>
> **[Payments & Transaction Service (Original repository)](https://github.com/MaksymPohribnyi/ProfITsoft-nestjs-insurance-app)**
>
> **[Email Notification Consumer (Original repository)](https://github.com/MaksymPohribnyi/ProfITsoft-async-notifications)**

## 🏗️ Architecture & Services

### The system is composed of the following microservices:
| Service	| Directory |	Technology | Description |	Port |
|---------|-----------|------------|-------------|-------|
| **Gateway Service** |gateway     | Java / Spring Cloud Gateway | Entry point, handles routing, OAuth2 authentication, and load balancing | 1000 |
| **Backend Service** | rest-insurance |	Java / Spring Boot |	Core business logic for managing clients and insurance policies. Uses PostgreSQL |	8080 |
| **Payments Service**|  nestjs-payments |	Node.js / NestJS |	Manages payment transactions and validation. Uses MongoDB |	7777  | 
| **Notification Service**| notification-service |	Java / Spring Boot | Listens to Kafka topics to send email notifications|	8081 |
| **Frontend**| front-end |	React / Redux |	User interface for managing clients and policies |	80 |

## 🛠 Built With

* **Java 21**
* **Spring boot 4.0.1**
* **NestJS 11.0.1**
* **Node.js v18+**
* **Cloud & DevOps** (Google Kubernetes Engine (GKE), Docker, GitHub Actions, Manifests)
* **Spring Security, OAuth2 (Google)**
* **Gradle**

### Infrastructure Components

* **PostgreSQL**
* **MongoDB**
* **Apache Kafka & Zookeeper**
* **Consul**
* **Kibana & Elasticsearch**

## 🚀 Getting Started

### 💻 Local Development
You can run the entire system locally using Docker Compose.

### 1.  Clone the repository
```bash
git clone https://github.com/MaksymPohribnyi/ProfITsoft-async-notifications.git
cd profITsoft-async-notifications
```

### 2. Configure Environment
Ensure you have a `.env` file or use `.env.origin` as a references set for Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET).

### 3. Running the application using Docker Compose
This will start all databases, infrastructure Components, backend services, and the frontend.

```bash
# Build and start the entire services
docker-compose up -d --build
```

The API will be available at: http://localhost:1000

## ☁️ Deployment to Google Kubernetes Engine (GKE)

This project utilizes a Split-Repository architecture to separate source code from deployment configuration.
* **Microservices Repository** (Current): Contains source code, Dockerfiles, and CI build logic.
* **[Deployment Repository](https://github.com/MaksymPohribnyi/ProfITsoft-cloud-deployment)**: Contains K8S manifests (.yaml), infrastructure configuration, and the CD to apply changes to the GKE cluster

## 🔐 Configuration & Secrets

To enable the CI/CD pipelines to interact with Google Cloud and link the two repos, you should  configure specific GitHub secrets in repo settings:

### 1️⃣ Secrets for THIS Repository
### `ProfITsoft-cloud-microservices`

This repository needs permission to **trigger deployments** in the external deployment repository.

### Required Secrets

| Secret Name | Description             | How to Generate                                                                                                                        |
|------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| PROFITSOFT_CLOUD_REPO_SECRET | GitHub Personal Access Token (PAT) | 1. Go to **GitHub Developer Settings → Generate a new Personal access tokens with scope `repo` (Tokens classic)** |

### 2️⃣ Secrets for [DEPLOYMENT](https://github.com/MaksymPohribnyi/ProfITsoft-cloud-deployment) Repository
### `ProfITsoft-cloud-deployment`

This repository performs the **actual deployment to Google Kubernetes Engine (GKE)**

### Required Google Cloud secrets

| Secret | Purpose |
|------|--------|
| GKE_SA_KEY | GCP Service Account JSON key |
| GKE_PROJECT | Google Cloud project ID |
| GKE_CLUSTER | Kubernetes cluster name |
| GKE_ZONE | Cluster zone |
| IMAGE_OWNER | GitHub username for GHCR images |
| GOOGLE_CLIENT_ID | OAuth2 client ID |
| GOOGLE_CLIENT_SECRET | OAuth2 client secret |
| POSTGRES_DB | Database name |
| POSTGRES_USER | Database user |
| POSTGRES_PASSWORD | Database password |
| SMTP_USERNAME | email login |
| SMTP_PASSWORD | email password |

Required roles for the Service Account in Google Cloud Console:
- Kubernetes Engine Developer
- Owner

## 🔄 CI/CD Pipeline

### 1. Build & Push `ci.yml`

**Trigger**
- Push to `master`

**Steps**
1. Detect changes in service directories
2. Run tests, build Docker images
3. Push images to GitHub Container Registry (`ghcr.io`)
4. Send `repository_dispatch` event to Deployment repo

---

### 2. Deploy `deploy.yml`
**Repository:** Deployment repo

**Trigger**
- `repository_dispatch` event

**Steps**
1. Authenticate with Google Cloud
2. Update Kubernetes Secrets
3. Update ConfigMaps
4. Apply manifests, restart deployments




