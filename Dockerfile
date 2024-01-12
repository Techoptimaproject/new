# Use Node.js image for building the Angular app
FROM node:18.17.1-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Run Angular Compatibility Compiler (ngcc)
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build

# Use Nginx as the base image for the final stage
FROM nginx:stable

# Copy the built Angular app to the Nginx public directory
COPY --from=build /app/dist/FSProvderPortal /usr/share/nginx/html

# Expose port 80
EXPOSE 80







# FROM node:18.17.1-alpine AS build 
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
# COPY . .
# RUN npm run build
# FROM nginx:stable 
# COPY --from =build /app/FSProvderPortal//usr/share/nginx/html
# EXPOSE 80






# # # Use an official Node runtime as a parent image
# # FROM node:14-alpine as builder

# # Use an official Node runtime as a parent image
# FROM node:latest  as build

# # Set the working directory
# #WORKDIR /app

# # Set the working directory
# WORKDIR /usr/local/app


# # # Copy package.json and package-lock.json to the working directory
# # COPY package*.json ./

# # Copy package.json and package-lock.json to the working directory
# COPY  ./ /usr/local/app/

# # Install dependencies
# RUN npm install

# # # Copy the application files
# # COPY . .

# # Build the Angular app
# RUN npm run build --prod


# #use offical nginx image as the base iamge
# FROM nginx:latest

# # # Copy the built Angular app to the Nginx public directory
# # COPY --from=builder /app/dist/your-angular-app /usr/share/nginx/html

# # Copy the built Angular app to the Nginx public directory
# COPY --from=build /usr/local/app/dist/FSProvderPortal /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # # Start Nginx
# # CMD ["nginx", "-g", "daemon off;"]
