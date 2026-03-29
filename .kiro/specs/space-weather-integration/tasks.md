# Implementation Plan: Space Weather Integration

## Overview

This implementation plan breaks down the space weather integration feature into incremental coding tasks. The approach follows a bottom-up strategy: first implementing external API clients, then building the service layer for threat analysis and asset management, followed by API endpoints, database models, and finally frontend integration. Each task builds on previous work, with checkpoints to validate progress.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create directory structure for space weather components
  - Add required Python packages to requirements.txt (httpx, apscheduler, hypothesis for testing)
  - Create TypeScript type definitions file for space weather data
  - _Requirements: 10.1, 10.2_

- [x] 2. Implement Pydantic schemas for space weather data
  - [x] 2.1 Create schemas for SWPC data models (SolarWindData, MagneticFieldData, KpIndexData, SpaceWeatherSnapshot)
    - Define Pydantic models with field validation
    - Include timestamp parsing and serialization
    - _Requirements: 1.2, 1.3, 1.4, 2.2, 2.3, 2.4, 3.2, 3.3_
  
  - [ ]* 2.2 Write property test for space weather JSON round-trip
    - **Property 1: JSON Parsing Round-Trip for Space Weather Data**
    - **Validates: Requirements 10.1, 10.3, 10.5**
  
  - [x] 2.3 Create schemas for DONKI data models (CMEForecast, SolarFlare, ForecastSnapshot)
    - Define Pydantic models with field validation
    - Implement CME priority flag logic
    - Implement solar flare priority classification
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 2.4 Write property test for forecast data JSON round-trip
    - **Property 2: JSON Parsing Round-Trip for Forecast Data**
    - **Validates: Requirements 10.2, 10.4, 10.6**
  
  - [ ]* 2.5 Write property tests for classification logic
    - **Property 3: Kp Index Classification Boundaries**
    - **Property 4: CME Priority Flag Logic**
    - **Property 5: Solar Flare Priority Classification**
    - **Validates: Requirements 3.4, 3.5, 3.6, 4.6, 5.5, 5.6**
  
  - [x] 2.6 Create schemas for threat and asset models (ThreatClassification, ThreatAssessment, AssetStatus, AssetStatusSummary, DashboardData)
    - Define enums and composite models
    - _Requirements: 6.5, 6.6, 7.1, 7.2, 7.3, 7.4_

- [x] 3. Implement SWPC API client
  - [x] 3.1 Create SWPCClient class with async HTTP methods
    - Implement fetch_solar_wind() method for plasma-1-day.json endpoint
    - Implement fetch_magnetic_field() method for mag-1-day.json endpoint
    - Implement fetch_kp_index() method for noaa-planetary-k-index.json endpoint
    - Implement fetch_all() method to aggregate all SWPC data
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_
  
  - [x] 3.2 Implement Kp index status classification logic
    - Add classification method (QUIET: 0-4, ACTIVE: 5-6, STORM: 7-9)
    - _Requirements: 3.4, 3.5, 3.6_
  
  - [x] 3.3 Implement error handling and caching
    - Add retry logic for HTTP 429 (wait 60s) and 5xx errors (exponential backoff)
    - Implement in-memory cache for last successful response
    - Add network error handling with cache fallback
    - _Requirements: 1.5, 2.5, 11.1, 11.3, 11.4, 11.5_
  
  - [ ]* 3.4 Write unit tests for SWPC client
    - Test successful API responses with mock data
    - Test error handling scenarios (rate limits, server errors, network failures)
    - Test cache behavior
    - _Requirements: 1.1, 1.5, 11.1, 11.3_

- [-] 4. Implement DONKI API client
  - [x] 4.1 Create DONKIClient class with NASA API key authentication
    - Implement fetch_cme_forecasts() method for CME endpoint
    - Implement fetch_solar_flares() method for FLR endpoint
    - Implement fetch_all_forecasts() method to aggregate DONKI data
    - Load NASA_API_KEY from environment variables
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_
  
  - [x] 4.2 Implement error handling and caching
    - Add authentication error handling (HTTP 401/403)
    - Add retry logic for HTTP 429 (wait 300s) and 5xx errors
    - Implement in-memory cache for last successful response
    - _Requirements: 4.7, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 4.3 Write unit tests for DONKI client
    - Test successful API responses with mock data
    - Test authentication errors
    - Test error handling and cache behavior
    - _Requirements: 4.1, 4.7, 11.2_

- [ ] 5. Checkpoint - Ensure API clients work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [-] 6. Implement Threat Analyzer service
  - [ ] 6.1 Create ThreatAnalyzer class with detection methods
    - Implement detect_shield_breach() method (speed > 600 km/s AND Bz < -10 nT)
    - Implement detect_geomagnetic_storm() method (Kp > 7.0)
    - Implement detect_incoming_cme() method (Earth-directed AND speed > 1000 km/s)
    - Implement detect_radiation_storm() method (X-class flare detected)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 6.2 Implement threat analysis and scoring
    - Implement analyze() method to evaluate all conditions
    - Implement calculate_composite_score() method (shield_breach*40 + geomagnetic_storm*30 + incoming_cme*20 + radiation_storm*10)
    - Return all active threat classifications
    - _Requirements: 6.5, 6.6_
  
  - [ ]* 6.3 Write property tests for threat detection logic
    - **Property 6: Shield Breach Detection Logic**
    - **Property 7: Geomagnetic Storm Detection Logic**
    - **Property 8: Incoming CME Detection Logic**
    - **Property 9: Radiation Storm Detection Logic**
    - **Property 10: Multiple Threat Detection Completeness**
    - **Property 11: Composite Threat Score Bounds**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
  
  - [ ]* 6.4 Write unit tests for threat analyzer
    - Test specific threat scenarios with known inputs
    - Test edge cases (boundary values for thresholds)
    - Test composite score calculation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 7. Implement Asset Manager service
  - [ ] 7.1 Create AssetManager class with status update methods
    - Implement update_asset_statuses() method to update based on threats
    - Implement restore_safe_status() method to clear threat statuses
    - Implement get_asset_summary() method to aggregate status counts
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 7.2 Implement status update rules
    - SHIELD_BREACH → All satellites to CRITICAL
    - GEOMAGNETIC_STORM → Transformers/power grids to CAUTION
    - RADIATION_STORM → Aircraft to CAUTION
    - No threats → All assets to SAFE
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 7.3 Implement status change logging
    - Record UTC timestamp for each status change
    - Log asset identifier, threat classification, previous status, new status
    - _Requirements: 7.5, 7.6_
  
  - [ ]* 7.4 Write property tests for asset status updates
    - **Property 12: Satellite Status Update on Shield Breach**
    - **Property 13: Transformer Status Update on Geomagnetic Storm**
    - **Property 14: Aircraft Status Update on Radiation Storm**
    - **Property 15: Asset Status Restoration on Threat Clearance**
    - **Property 16: Status Change Timestamp Recording**
    - **Property 17: Status Change Logging Completeness**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**
  
  - [ ]* 7.5 Write unit tests for asset manager
    - Test status updates with mock database
    - Test logging functionality
    - Test asset summary aggregation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [-] 8. Implement Dashboard Service
  - [ ] 8.1 Create DashboardService class with data aggregation methods
    - Implement get_current_conditions() method
    - Implement get_threat_status() method
    - Implement get_asset_summary() method
    - Implement get_forecast_data() method
    - Implement get_dashboard_data() method (unified endpoint)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ] 8.2 Implement cache staleness indicator
    - Calculate cache_age_seconds from last fetch timestamp
    - Include in all responses when serving cached data
    - _Requirements: 11.6_
  
  - [ ] 8.3 Implement ISO 8601 timestamp formatting
    - Ensure all timestamp fields use ISO 8601 format with timezone
    - _Requirements: 8.8_
  
  - [ ]* 8.4 Write property tests for dashboard service
    - **Property 18: ISO 8601 Timestamp Format**
    - **Property 20: Cache Staleness Indicator Presence**
    - **Validates: Requirements 8.8, 11.6**
  
  - [ ]* 8.5 Write unit tests for dashboard service
    - Test data aggregation with mock database
    - Test cache age calculation
    - Test timestamp formatting
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 9. Checkpoint - Ensure service layer works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Create database models and migration
  - [ ] 10.1 Add space weather database models to models.py
    - Create SolarWindMeasurement model
    - Create MagneticFieldMeasurement model
    - Create KpIndexMeasurement model
    - Create CMEEvent model
    - Create SolarFlareEvent model
    - Create ThreatDetection model
    - Create AssetStatusLog model
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [ ] 10.2 Update existing Satellite model
    - Add asset_type column (default: 'SATELLITE')
    - Add status column (default: 'SAFE')
    - _Requirements: 7.1, 7.4_
  
  - [ ] 10.3 Create Alembic migration script
    - Generate migration for all new tables
    - Add columns to satellites table
    - Include indexes for timestamp and activity_id columns
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [ ]* 10.4 Write property tests for database persistence
    - **Property 21: Database Persistence Round-Trip for Solar Wind**
    - **Property 22: Database Persistence Round-Trip for Magnetic Field**
    - **Property 23: Database Persistence Round-Trip for Kp Index**
    - **Property 24: Database Persistence Round-Trip for CME Events**
    - **Property 25: Database Persistence Round-Trip for Solar Flare Events**
    - **Property 26: Database Persistence Round-Trip for Threat Detections**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**

- [-] 11. Implement space weather API router
  - [ ] 11.1 Create space_weather.py router in routers directory
    - Create GET /api/v1/space-weather/current endpoint
    - Create GET /api/v1/space-weather/threats endpoint
    - Create GET /api/v1/space-weather/assets endpoint
    - Create GET /api/v1/space-weather/forecasts endpoint
    - Create GET /api/v1/space-weather/dashboard endpoint (unified)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ] 11.2 Wire router to main FastAPI app
    - Import space_weather router in main.py
    - Add router with prefix and tags
    - _Requirements: 8.1_
  
  - [ ]* 11.3 Write integration tests for API endpoints
    - Test all endpoints with mock services
    - Test error responses
    - Test JSON response format
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 12. Implement background polling service
  - [ ] 12.1 Create PollingManager class with APScheduler
    - Implement poll_swpc() method (every 5 minutes)
    - Implement poll_donki() method (every 30 minutes)
    - Store fetched data in database
    - Trigger threat analysis after each poll
    - Trigger asset status updates based on threats
    - _Requirements: 1.6, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3_
  
  - [ ] 12.2 Wire polling manager to FastAPI lifespan
    - Initialize polling manager on app startup
    - Start scheduler in lifespan context
    - Stop scheduler on app shutdown
    - _Requirements: 1.6_
  
  - [ ]* 12.3 Write integration tests for polling workflow
    - Test polling cycle with mock API clients
    - Test threat detection trigger
    - Test asset update trigger
    - _Requirements: 1.6, 6.5, 7.1_

- [ ] 13. Update configuration management
  - [ ] 13.1 Add space weather settings to config.py
    - Add NASA_API_KEY setting
    - Add SWPC_POLL_INTERVAL_MINUTES setting (default: 5)
    - Add DONKI_POLL_INTERVAL_MINUTES setting (default: 30)
    - Add CACHE_ENABLED setting (default: True)
    - Add API_TIMEOUT_SECONDS setting (default: 30)
    - _Requirements: 4.1, 11.5_
  
  - [ ] 13.2 Update .env.example file
    - Add NASA_API_KEY placeholder
    - Add polling interval settings
    - Document required environment variables
    - _Requirements: 4.1_

- [ ] 14. Checkpoint - Ensure backend integration is complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Create TypeScript types for frontend
  - [ ] 15.1 Create space-weather.ts type definitions file
    - Define SolarWindData interface
    - Define MagneticFieldData interface
    - Define KpIndexData interface
    - Define ThreatAssessment interface
    - Define AssetStatusSummary interface
    - Define DashboardData interface
    - Define CMEForecast and SolarFlare interfaces
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 16. Implement frontend API client
  - [ ] 16.1 Create space-weather.ts API client in lib/api directory
    - Implement fetchDashboardData() function
    - Implement fetchCurrentConditions() function
    - Implement fetchThreatStatus() function
    - Implement fetchAssetSummary() function
    - Implement fetchForecastData() function
    - Add error handling for failed requests
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 17. Integrate space weather data into operator dashboard
  - [x] 17.1 Update operator dashboard page to fetch real data
    - Replace mock data with fetchDashboardData() call
    - Map API response to existing UI structure (target, actionLogs, telemetry, radiationScore, fleetCondition)
    - Implement polling with useEffect (every 30 seconds)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [x] 17.2 Implement helper functions for data transformation
    - Create generateLogsFromThreats() to convert threats to action logs
    - Create generateRadiationChart() to convert Kp index to chart data
    - Create calculateGlobalHealth() to compute health percentage from asset summary
    - _Requirements: 9.3, 9.4, 9.5, 9.6_
  
  - [x] 17.3 Update CME alert indicator
    - Display "DETECTED" when INCOMING_CME threat is active
    - Display "CLEAR" when no CME threat
    - Update alert styling based on threat level
    - _Requirements: 9.1, 9.2_
  
  - [x] 17.4 Update fleet condition display
    - Map safe_count to nominalAssets
    - Map caution_count to atRiskAssets
    - Map critical_count to maintenanceAssets
    - Calculate globalHealth percentage
    - _Requirements: 9.6_
  
  - [ ]* 17.5 Write component tests for dashboard integration
    - Test data fetching and state updates
    - Test error handling
    - Test polling behavior
    - _Requirements: 9.7_

- [ ] 18. Add visual threat indicators to dashboard
  - [ ] 18.1 Implement alert color coding
    - Display red indicators for CRITICAL threats (SHIELD_BREACH, RADIATION_STORM with high score)
    - Display yellow indicators for CAUTION threats (GEOMAGNETIC_STORM, INCOMING_CME)
    - Update existing UI elements to reflect threat levels
    - _Requirements: 9.1, 9.2_
  
  - [ ] 18.2 Implement Matrix-style scrolling logs
    - Convert threat events to log entries with timestamps
    - Display critical threats with red highlighting
    - Auto-scroll to latest entries
    - _Requirements: 9.3_
  
  - [ ] 18.3 Add solar wind and IMF Bz displays
    - Display current solar wind speed with trend indicator
    - Display current IMF Bz value with color coding (red if < -10 nT)
    - Add visual indicators for dangerous values
    - _Requirements: 9.5_

- [ ] 19. Final checkpoint - End-to-end validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify data flows from external APIs through backend to frontend
  - Verify threat detection triggers asset status updates
  - Verify dashboard displays real-time data correctly

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- The implementation follows a bottom-up approach: clients → services → API → database → frontend
- Background polling is implemented after core services are complete
- Frontend integration is the final step, building on completed backend infrastructure
