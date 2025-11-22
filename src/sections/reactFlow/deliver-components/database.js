import { useEffect, useState } from "react";
import { Grid, MenuItem, Typography, TextField } from "@mui/material";
import { RHFSelect } from "src/components/hook-form";
import axiosInstance from "src/utils/axios";

// 🔹 Dummy Locate JSON (replace later with actual data from Locate node)
const locateSchema = {
  jobTitle: "Frontend Developer",
  companyName: "Tech Corp",
  city: "Pune",
  expYears: "3",
  compensation: "12 LPA",
  jobDesc: "Responsible for frontend development",
  technologies: "React, Node.js",
};

export default function DatabaseComponents() {
  const [dbFields, setDbFields] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/deliver/model/Deliver")
      .then((res) => {
        if (res.data?.fields) {
          setDbFields(res.data.fields);
        }
      })
      .catch((err) => {
        console.error("Error fetching DB fields:", err);
      });
  }, []);

   return (
    <Grid container spacing={2}>
      {dbFields.map((field) => (
        <Grid container spacing={2} key={field} sx={{ mb: 1 }}>

          <Grid item xs={6}>
            <TextField
              fullWidth
              value={field}
              label="DB Field"
              InputProps={{ readOnly: true }}
            />
          </Grid>


          <Grid item xs={6}>
            <RHFSelect name={`mapping.${field}`} label="Locate Field">
              {Object.keys(locateSchema).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </RHFSelect>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}