FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY index.py .
COPY dissolved_gas.py .

# Expose the API port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Command to run the application using Uvicorn
CMD uvicorn index:app --host 0.0.0.0 --port ${PORT:=8080}
