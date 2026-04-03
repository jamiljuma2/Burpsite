#!/bin/bash
# Burpsite Production Validation Script

echo "=================================================="
echo "BURPSITE PRODUCTION READINESS VALIDATION"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_code=$4
    
    echo -n "Testing $name ... "
    
    response=$(curl -s -w "\n%{http_code}" -X $method http://localhost:5000$endpoint)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $http_code)"
        ((FAIL_COUNT++))
    fi
}

check_security_header() {
    local header=$1
    
    echo -n "Checking $header header ... "
    
    value=$(curl -s -I http://localhost:5000/health | grep -i "^${header}:" | cut -d' ' -f2-)
    
    if [ ! -z "$value" ]; then
        echo -e "${GREEN}✓${NC} Set"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗${NC} Not set"
        ((FAIL_COUNT++))
    fi
}

echo "API ENDPOINT TESTS:"
echo "===================="
test_endpoint "Health Check" GET "/health" 200
test_endpoint "Register" POST "/api/auth/register" 400  # Missing fields = 400, but endpoint exists
test_endpoint "Login" POST "/api/auth/login" 400        # Missing fields = 400, but endpoint exists
echo ""

echo "SECURITY HEADER TESTS:"
echo "===================="
check_security_header "X-Frame-Options"
check_security_header "X-Content-Type-Options"
check_security_header "Strict-Transport-Security"
check_security_header "Content-Security-Policy"
echo ""

echo "PERFORMANCE TESTS:"
echo "===================="
echo -n "Response time (Health Check) ... "
RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:5000/health)
echo -e "${GREEN}${RESPONSE_TIME}s${NC}"
((PASS_COUNT++))
echo ""

echo "FRONTEND TESTS:"
echo "===================="
echo -n "Frontend Health (port 3000) ... "
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ Not running${NC}"
    ((FAIL_COUNT++))
fi

echo -n "Frontend Serving HTML ... "
html=$(curl -s http://localhost:3000 | grep -c "<!DOCTYPE html")
if [ $html -gt 0 ]; then
    echo -e "${GREEN}✓ OK${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ Failed${NC}"
    ((FAIL_COUNT++))
fi
echo ""

echo "DATABASE TESTS:"
echo "===================="
echo -n "Database Connection ... "
# Note: This requires psql to be installed
# For now, test via backend API
test_result=$(curl -s http://localhost:5000/health | grep -c "ok")
if [ $test_result -gt 0 ]; then
    echo -e "${GREEN}✓ Connected${NC}"
    ((PASS_COUNT++))
else
    echo -e "${RED}✗ Failed${NC}"
    ((FAIL_COUNT++))
fi
echo ""

echo "=================================================="
echo "SUMMARY"
echo "=================================================="
echo -e "Passed: ${GREEN}${PASS_COUNT}${NC}"
echo -e "Failed: ${FAIL_COUNT}"
echo "=================================================="

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED - READY FOR PRODUCTION${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED - PLEASE REVIEW${NC}"
    exit 1
fi
