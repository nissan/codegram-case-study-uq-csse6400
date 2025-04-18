"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Code } from "@/components/ui/code"
import type { Filter } from "@/types/filter"

interface CodeTabProps {
  filters: Filter[]
}

export default function CodeTab({ filters }: CodeTabProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("pipeline")

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate sample pipeline code based on selected filters
  const generatePipelineCode = () => {
    const filterImports = filters
      .map((f) => `from filters.${f.name} import ${f.name.charAt(0).toUpperCase() + f.name.slice(1)}Filter`)
      .join("\n")

    const filterInstances = filters
      .map((f) => {
        const params = Object.entries(f.params)
          .map(([key, value]) => `${key}=${value}`)
          .join(", ")
        return `    ${f.name}_filter = ${f.name.charAt(0).toUpperCase() + f.name.slice(1)}Filter(${params})`
      })
      .join("\n")

    const filterPipeline = filters.map((f) => `    image = ${f.name}_filter.apply(image)`).join("\n")

    return `import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
import asyncio
import httpx
${filterImports}

app = FastAPI(
    title="Codegram Filter API",
    description="API for applying image filters",
    version="1.0.0"
)

class FilterRequest(BaseModel):
    image_url: HttpUrl
    filters: list[dict]

class FilterResponse(BaseModel):
    status: str
    image: str

@app.post("/filter", response_model=FilterResponse)
async def apply_filters(request: FilterRequest):
    try:
        # Load image from URL asynchronously
        image = await load_image_from_url(request.image_url)
        
        # Initialize filters
${filterInstances}
        
        # Apply filters in sequence
${filterPipeline}
        
        # Encode and return processed image
        return {
            "status": "success",
            "image": encode_image_to_base64(image)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def load_image_from_url(url: HttpUrl):
    async with httpx.AsyncClient() as client:
        response = await client.get(str(url))
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")
        
        # Convert to numpy array and decode
        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        return cv2.imdecode(image_array, cv2.IMREAD_COLOR)

def encode_image_to_base64(image):
    # Implementation to encode image to base64
    import base64
    success, encoded_image = cv2.imencode('.jpg', image)
    if not success:
        raise Exception("Failed to encode image")
    return base64.b64encode(encoded_image.tobytes()).decode('utf-8')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`
  }

  // Sample filter code
  const sampleFilterCode = `import cv2
import numpy as np
from typing import Dict, Any

class GrayscaleFilter:
    def __init__(self, intensity=100):
        self.intensity = intensity / 100.0
        
    def apply(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray_3c = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        
        # Apply intensity as alpha blend between original and grayscale
        return cv2.addWeighted(image, 1 - self.intensity, gray_3c, self.intensity, 0)

class BrightnessFilter:
    def __init__(self, level=50):
        # Convert 0-100 range to -50 to 50
        self.level = level - 50
        
    def apply(self, image):
        if self.level == 0:
            return image
            
        # Apply brightness adjustment
        if self.level > 0:
            return cv2.convertScaleAbs(image, alpha=1, beta=self.level * 5)
        else:
            return cv2.convertScaleAbs(image, alpha=1, beta=self.level * 5)

class BlurFilter:
    def __init__(self, radius=5):
        self.radius = max(1, int(radius / 10))
        
    async def apply_async(self, image):
        # Example of how we could make this async for CPU-intensive operations
        # In a real implementation, we might use a thread pool or other async approach
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.apply, image)
        
    def apply(self, image):
        # Apply Gaussian blur
        return cv2.GaussianBlur(image, (self.radius*2+1, self.radius*2+1), 0)`

  // Sample request code
  const sampleRequestCode = `// Example API request using fetch
const applyFilters = async (imageUrl, filters) => {
  try {
    const response = await fetch('https://api.codegram.dev/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        filters: filters
      }),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // Display the processed image
      const imgElement = document.getElementById('result-image');
      imgElement.src = 'data:image/jpeg;base64,' + data.image;
    } else {
      console.error('Error processing image:', data.error);
    }
  } catch (error) {
    console.error('API request failed:', error);
  }
};

// Example usage
const filters = ${JSON.stringify(
    filters.map((f) => ({
      name: f.name,
      params: f.params,
    })),
    null,
    2,
  )};

applyFilters('https://example.com/code-snippet.jpg', filters);`

  // Terraform code
  const terraformCode = `# ECS Fargate Service for Codegram API

provider "aws" {
  region = "us-west-2"
}

# ECR Repository for Docker images
resource "aws_ecr_repository" "codegram_api" {
  name = "codegram-api"
  image_tag_mutability = "MUTABLE"
}

# IAM role for ECS task execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Effect = "Allow",
        Sid = ""
      }
    ]
  })
}

resource "aws_iam_policy" "ecs_execution_policy" {
  name        = "ecs-execution-policy"
  description = "Grants ECS task execution access to AWS resources"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.ecs_execution_policy.arn
}

# IAM role for ECS tasks
resource "aws_iam_role" "ecs_task_role" {
  name = "ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Effect = "Allow",
        Sid = ""
      }
    ]
  })
}

# ECS Cluster
resource "aws_ecs_cluster" "codegram" {
  name = "codegram-cluster"
}

# Task Definition
resource "aws_ecs_task_definition" "codegram_api" {
  family                   = "codegram-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  
  container_definitions = jsonencode([{
    name      = "codegram-api"
    image     = "\${aws_ecr_repository.codegram_api.repository_url}:latest"
    essential = true
    
    portMappings = [{
      containerPort = 8000
      hostPort      = 8000
      protocol      = "tcp"
    }]
    
    environment = [
      { name = "ENVIRONMENT", value = "production" }
    ]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/codegram-api"
        "awslogs-region"        = "us-west-2"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "codegram_api" {
  name            = "codegram-api"
  cluster         = aws_ecs_cluster.codegram.id
  task_definition = aws_ecs_task_definition.codegram_api.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.codegram_api.arn
    container_name   = "codegram-api"
    container_port   = 8000
  }
}

# Application Load Balancer
resource "aws_lb" "codegram" {
  name               = "codegram-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnets
}

# Target Group
resource "aws_lb_target_group" "codegram_api" {
  name        = "codegram-api"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  
  health_check {
    path                = "/docs"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

# S3 Bucket for image cache
resource "aws_s3_bucket" "image_cache" {
  bucket = "codegram-image-cache"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "codegram_cdn" {
  origin {
    domain_name = aws_s3_bucket.image_cache.bucket_regional_domain_name
    origin_id   = "S3-codegram-image-cache"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.codegram.cloudfront_access_identity_path
    }
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-codegram-image-cache"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "codegram" {
  comment = "OAI for Codegram image cache"
}`

  // Updated C4 Model DSL for Structurizr - Fixed deployment view reference
  const c4ModelCode = `workspace {
    name "Codegram Filter Pipeline"
    description "C4 model for the Codegram image filter pipeline architecture"

    model {
        user = person "User" "A programmer who wants to share code screenshots"
        
        group "Codegram" {
            codegramSystem = softwareSystem "Codegram Platform" "Social media platform for programmers to share code screenshots" {
                webapp = container "Web Application" "Provides the Codegram UI and user experience" "React, Next.js" {
                    filterUI = component "Filter UI" "Allows users to select and configure image filters" "React Components"
                    imagePreview = component "Image Preview" "Shows original and processed images" "React Components"
                    apiClient = component "API Client" "Communicates with the Filter API" "JavaScript, Fetch API"
                }
                
                filterAPI = container "Filter API" "Processes images with selected filters" "FastAPI, Python" {
                    apiEndpoints = component "API Endpoints" "Exposes RESTful endpoints for image processing" "FastAPI Routes"
                    imageLoader = component "Image Loader" "Loads images from URLs or file uploads" "Python, httpx"
                    filterPipeline = component "Filter Pipeline" "Applies filters in sequence" "Python"
                    grayscaleFilter = component "Grayscale Filter" "Converts image to grayscale" "OpenCV"
                    brightnessFilter = component "Brightness Filter" "Adjusts image brightness" "OpenCV"
                    contrastFilter = component "Contrast Filter" "Adjusts image contrast" "OpenCV"
                    blurFilter = component "Blur Filter" "Applies Gaussian blur" "OpenCV"
                    sharpenFilter = component "Sharpen Filter" "Enhances image details" "OpenCV"
                }
                
                imageCache = container "Image Cache" "Stores processed images" "Amazon S3"
                cdn = container "Content Delivery Network" "Distributes processed images globally" "CloudFront"
                database = container "Analytics Database" "Stores filter usage statistics" "Amazon RDS, PostgreSQL"
            }
            
            deploymentEnvironment = deploymentEnvironment "AWS Cloud" {
                deploymentNode "AWS Region" {
                    deploymentNode "VPC" {
                        deploymentNode "Public Subnet" {
                            loadBalancerInstance = infrastructureNode "Application Load Balancer" "Routes traffic to ECS tasks"
                            cdnInstance = infrastructureNode "CloudFront Distribution" "Serves cached images"
                        }
                        
                        deploymentNode "Private Subnet" {
                            deploymentNode "ECS Cluster" {
                                ecsService = infrastructureNode "ECS Fargate Service" "Runs the Filter API containers"
                                
                                deploymentNode "ECS Task" "Filter API Container" {
                                    filterApiInstance = containerInstance filterAPI
                                }
                            }
                            
                            deploymentNode "Database Subnet" {
                                rdsInstance = infrastructureNode "RDS Instance" "Runs the PostgreSQL database"
                            }
                        }
                    }
                    
                    deploymentNode "S3" {
                        s3Instance = infrastructureNode "S3 Bucket" "Stores processed images"
                    }
                    
                    deploymentNode "ECR" {
                        ecrInstance = infrastructureNode "ECR Repository" "Stores Docker images"
                    }
                }
            }
        }
        
        # Relationships
        user -> webapp "Uses"
        webapp -> filterAPI "Sends image processing requests to" "HTTPS"
        filterAPI -> imageCache "Stores processed images in" "AWS SDK"
        imageCache -> cdn "Distributes images via"
        filterAPI -> database "Logs filter usage to" "SQL"
        
        # Component relationships
        filterUI -> apiClient "Uses"
        apiClient -> apiEndpoints "Sends requests to" "HTTPS"
        apiEndpoints -> imageLoader "Uses"
        apiEndpoints -> filterPipeline "Uses"
        filterPipeline -> grayscaleFilter "Uses when enabled"
        filterPipeline -> brightnessFilter "Uses when enabled"
        filterPipeline -> contrastFilter "Uses when enabled"
        filterPipeline -> blurFilter "Uses when enabled"
        filterPipeline -> sharpenFilter "Uses when enabled"
        
        # Deployment relationships
        loadBalancerInstance -> ecsService "Routes traffic to"
        ecsService -> filterApiInstance "Runs"
        filterApiInstance -> rdsInstance "Connects to"
        filterApiInstance -> s3Instance "Stores images in"
        s3Instance -> cdnInstance "Origin for"
    }
    
    views {
        systemContext codegramSystem "SystemContext" {
            include *
            autoLayout
        }
        
        container codegramSystem "Containers" {
            include *
            autoLayout
        }
        
        component filterAPI "FilterAPIComponents" {
            include *
            autoLayout
        }
        
        component webapp "WebAppComponents" {
            include *
            autoLayout
        }
        
        deployment codegramSystem "AWS Cloud" {
            include *
            autoLayout
        }
        
        theme default
        
        styles {
            element "Person" {
                shape Person
                background #08427B
                color #ffffff
            }
            element "Software System" {
                background #1168BD
                color #ffffff
            }
            element "Container" {
                background #438DD5
                color #ffffff
            }
            element "Component" {
                background #85BBF0
                color #000000
            }
            element "Infrastructure Node" {
                shape Hexagon
                background #999999
                color #ffffff
            }
        }
    }
}`

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Examples</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("pipeline")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "pipeline"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Pipeline
                </button>
                <button
                  onClick={() => setActiveTab("filters")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "filters"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Filters
                </button>
                <button
                  onClick={() => setActiveTab("request")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "request"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  API Request
                </button>
                <button
                  onClick={() => setActiveTab("terraform")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "terraform"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Terraform
                </button>
                <button
                  onClick={() => setActiveTab("c4model")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "c4model"
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  C4 Model
                </button>
              </div>
            </div>

            {activeTab === "pipeline" && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">FastAPI Backend</h3>
                <Code language="python">{generatePipelineCode()}</Code>
              </div>
            )}

            {activeTab === "filters" && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Filter Implementations</h3>
                <Code language="python">{sampleFilterCode}</Code>
              </div>
            )}

            {activeTab === "request" && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">JavaScript API Client</h3>
                <Code language="javascript">{sampleRequestCode}</Code>
              </div>
            )}

            {activeTab === "terraform" && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Infrastructure as Code</h3>
                <Code language="terraform">{terraformCode}</Code>
              </div>
            )}

            {activeTab === "c4model" && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">C4 Model DSL for Structurizr</h3>
                  <a
                    href="https://structurizr.com/dsl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Open Structurizr DSL Editor
                  </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Copy this code into the Structurizr DSL editor to visualize the C4 model for the Codegram
                  architecture. The model includes context, container, component, and deployment diagrams.
                </p>
                <Code language="javascript">{c4ModelCode}</Code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
