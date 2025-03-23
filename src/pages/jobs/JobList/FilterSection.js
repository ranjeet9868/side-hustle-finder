// src/pages/jobs/JobList/FilterSection.js
import React from "react";
import {
  Box,
  Grid,
  Button,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function FilterSection({
  filterableFields,
  filters,
  addFilter,
  removeFilter,
  updateFilter,
  clearAllFilters,
}) {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        {filters.map((filter, index) => (
          <React.Fragment key={index}>
            <Grid item xs={4} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Field</InputLabel>
                <Select
                  label="Field"
                  value={filter.field}
                  onChange={(e) => updateFilter(index, e.target.value, null)}
                >
                  {filterableFields.map((f) => (
                    <MenuItem key={f.value} value={f.value}>
                      {f.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={7}>
              <TextField
                label="Value"
                fullWidth
                value={filter.value}
                onChange={(e) => updateFilter(index, null, e.target.value)}
              />
            </Grid>
            <Grid item xs={2} sm={2}>
              <IconButton color="error" onClick={() => removeFilter(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={addFilter}>
          + Add Filter
        </Button>
        <Button variant="outlined" color="secondary" onClick={clearAllFilters}>
          Clear All
        </Button>
      </Box>
    </Box>
  );
}
