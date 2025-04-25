
https://github.com/user-attachments/assets/50e07fd6-1079-44ae-a6af-2df3fef0754e
# Bajaj Finserv Frontend Task

## Overview
A responsive search interface implementation for the Bajaj Finserv frontend challenge.

## Demo



https://github.com/user-attachments/assets/d80a31f2-206e-4b78-ae39-b2dc837b9062





## Tasks 

1. **API Integration**:
   - ✅ API URL is being used to fetch doctor data
   - ✅ Filtering, searching, and sorting are done client-side
   - ✅ URL query parameters are used to track filter state
   - ✅ Browser navigation (back/forward) retains filters

2. **Autocomplete Search Bar**:
   - ✅ Dropdown shows suggestions while typing
   - ✅ Limited to top 3 matches based on name
   - ✅ Clicking suggestion or pressing Enter filters results
   - ✅ No suggestions shown when no matches found
   - ✅ Has required `data-testid="autocomplete-input"` and `data-testid="suggestion-item"`

3. **Filter Panel**:
   - ✅ Single select consultation type filter (Radio buttons)
     - ✅ Video Consult and In Clinic options
     - ✅ Has required `data-testid="filter-video-consult"` and `data-testid="filter-in-clinic"`
   - ✅ Multi-select specialty filter (Checkboxes)
     - ✅ Options based on dataset specialties
     - ✅ Has all required specialty data-testid attributes
   - ✅ Sort options
     - ✅ Fees (ascending) and Experience (descending)
     - ✅ Has required `data-testid="sort-fees"` and `data-testid="sort-experience"`
   - ✅ Filter headers have required data-testid attributes

4. **Doctor List Display**:
   - ✅ Cards display properly with doctor information
   - ✅ Has all required data-testid attributes for each card element
   - ✅ Fixed the inconsistent card sizing issue

5. **Combined Filtering**:
   - ✅ Filters work in combination with the first applied filter taking precedence
   - ✅ All filters are reflected in URL query parameters

