"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';

import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./page.module.css"
import "../globals.css"
// Provided data arrays
const locations = [
  "Pune",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Ahmedabad",
  "Lucknow",
  "Hyderabad",
  "Chandigarh",
  "Jaipur",
  "Surat",
  "Kolkata",
  "Noida",
  "Gurgaon",
];
const Specializations = [
  "Dermatology",
  "Dental",
  "Orthopedics",
  "Pediatrics",
  "Cardiology",
  "Gynecology",
  "General Physician",
  "Neurology",
  "Psychiatry",
  "ENT",
  "Ophthalmology",
  "Pulmonology",
  "Endocrinology",
];
const Experiences = [8, 4, 10, 6, 15, 12, 20, 9, 14, 7, 11, 5, 16, 13, 3, 18];
const Fees = [800, 450, 1200, 700, 1500, 950, 600, 750, 1800, 1300, 900, 1000, 500, 1100, 1400, 400, 850, 1600];
const Languages = [
  "English",
  "Hindi",
  "Marathi",
  "Punjabi",
  "Kannada",
  "Tamil",
  "Gujarati",
  "Telugu",
  "Malayalam",
  "Bengali",
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: "",
    location: "",
    availability: "",
    minExperience: "",
    maxFees: "",
    language: "",
  });

  const [NewDoc, setNewDoc] = useState({
    name: "",
    specialization: "",
    location: "",
    availability: false,
    experience: 0,
    fees: 0,
    language: [],
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 3;
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [Pane, setPane]= useState(false);

  // Sort Experiences and Fees arrays in ascending order for dropdowns
  const sortedExperiences = Experiences.slice().sort((a, b) => a - b);
  const sortedFees = Fees.slice().sort((a, b) => a - b);

  // Fetch doctors based on filters and pagination
  const fetchDoctors = async () => {
    setLoading(true);

    // Prepare filters: remove empty values and add pagination params
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    activeFilters.page = page;
    activeFilters.limit = limit;

    const queryParams = new URLSearchParams(activeFilters).toString();
    const apiUrl = `https://intern-b-shreyas-zopes-projects.vercel.app/api/doctors?${queryParams}`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        console.error("Failed to fetch doctors:", res.status, res.statusText);
        setDoctors([]);
      } else {
        const data = await res.json();
        setDoctors(data.doctors || []);
        setTotalDoctors(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDoctors();
  }, [filters, page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };
  const handleAddDoctorClick = () => {
    setPane(true);

  }
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Log the name and value for every change
    console.log("Input Change - Name:", name, "Value:", value, "Type:", type);

    if (type === 'checkbox') {
      setNewDoc(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'language') {
      // Log specifically for language
      console.log("Language Change - Received Value:", value);
      // Ensure value is always treated as an array
      const selectedLangs = typeof value === 'string' ? value.split(',') : value;
      console.log("Language Change - Setting State To:", selectedLangs); // Log what state will be set to
      setNewDoc(prev => ({ ...prev, language: selectedLangs }));
    } else {
      // Handle standard text/number inputs and single selects
      setNewDoc(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value, 10) || 0 : value
      }));
    }
  };


  const handleSubmitNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://intern-b-shreyas-zopes-projects.vercel.app/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(NewDoc),
      });
      if (!res.ok) throw new Error('Failed to add doctor');
      // After successful save, refetch list or append locally
      fetchDoctors();
      // Reset form and close modal
      setNewDoc({ name: "", specialization: "", location: "", availability: false, experience: 0, fees: 0, language: [] });
      setPane(false);
    } catch (error) {
      console.error(error);
    }
  };
  const headerNavButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#555', // Slightly muted color
    cursor: 'pointer',
    padding: '5px 0', // Padding top/bottom
    fontSize: '0.9rem',
    fontWeight: '500',
    // Add hover effect styles if needed (better with CSS classes)
};


  const totalPages = Math.ceil(totalDoctors / limit);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Doctors Listing - Apollo Clone</title>
        <meta
          name="description"
          content="Find the best general physicians and internal medicine specialists."
        />
        <meta name="keywords" content="doctors, filters, apollo clone" />
        
      </Head>

            {/* Header */}
            <header
        style={{
          // Keep header sticky and styled
          backgroundColor: '#fdfeff',
          color: '#333',
          padding: '10px 30px', // Main padding
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Top Row: Logo, Search, Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // Removed marginBottom here, padding on header handles spacing
        }}>
          {/* Left: Logo */}
          <Image
            src={"/images/image.png"}
            alt="Logo"
            width={100}
            height={50}
            style={{
              objectFit: 'contain',
            }}
          />

          {/* Center: Search Bar Container */}
          <div style={{ flexGrow: 1, textAlign: 'center', padding: '0 20px' }}>
            <input
              type="text"
              placeholder="Search doctors, clinics, hospitals, etc."
              style={{
                padding: '8px 15px',
                width: '60%',
                maxWidth: '500px',
                border: '1px solid #ccc',
                borderRadius: '20px',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Right: Buttons Container */}
          {/* Adjusted width and added gap */}
          <div style={{ minWidth: '220px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {/* Add Doctor Button */}
            <button
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 'bold',
                padding: '0.3rem 0.8rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
              onClick={handleAddDoctorClick}
            >
              Add Doctor
            </button>
            {/* Login Button */}
            <button
              style={{
                color: '#16A34A',
                border: '1px solid #16A34A',
                backgroundColor: 'transparent',
                padding: '0.3rem 0.8rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
              }}
            >
              Login
            </button>
          </div>
        </div> {/* End of Top Row Div */}

        {/* Bottom Row: Navigation Links - Moved outside the top row div */}
        <div style={{ marginTop: '10px' }}> {/* Added margin-top for spacing */}
          <nav style={{
            display: 'flex',
            justifyContent: 'center', // Center the nav items
            gap: '20px', // Space between nav items
            paddingTop: '10px', // Increased space above the nav links
            borderTop: '1px solid #eee', // Optional separator line
          }}>
            {/* Navigation Items */}
            <button style={headerNavButtonStyle}>Buy Medicines</button>
            <button style={headerNavButtonStyle}>Find Doctors</button>
            <button style={headerNavButtonStyle}>Lab Tests</button>
            <button style={headerNavButtonStyle}>Circle Membership</button>
            <button style={headerNavButtonStyle}>Health Records</button>
            <button style={headerNavButtonStyle}>Diabetes Reversal</button>
            <button style={headerNavButtonStyle}>Buy Insurance</button>
          </nav>
        </div>
      </header>






      {/* Main layout container with custom classes */}
      <main className={styles[`layout`]}>
        {/* Filters Section (Left Side) */}
        <aside className={styles[`filters-panel`]}>
          <h2>Filters</h2>
          <div className="space-y-6">
            {/* Specialization Dropdown */}
            <div>
              <label htmlFor="specialization">Specialization</label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleChange}
              >
                <option value="">Select Specialization</option>
                {Specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleChange}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Dropdown */}
            <div>
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                value={filters.availability}
                onChange={handleChange}
              >
                <option value="">Any</option>
                <option value="true">Available Now</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {/* Minimum Experience Dropdown */}
            <div>
              <label htmlFor="minExperience">Minimum Experience (Years)</label>
              <select
                id="minExperience"
                name="minExperience"
                value={filters.minExperience}
                onChange={handleChange}
              >
                <option value="">Select Minimum Experience</option>
                {sortedExperiences.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp} years
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum Fees Dropdown */}
            <div>
              <label htmlFor="maxFees">Maximum Fees (₹)</label>
              <select
                id="maxFees"
                name="maxFees"
                value={filters.maxFees}
                onChange={handleChange}
              >
                <option value="">Select Maximum Fees</option>
                {sortedFees.map((fee) => (
                  <option key={fee} value={fee}>
                    ₹{fee}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Dropdown */}
            <div>
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={filters.language}
                onChange={handleChange}
              >
                <option value="">Select Language</option>
                {Languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Doctors List Panel (Right Side) */}
        <section className="doctors-panel">
          <h2>Doctors List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {doctors.length === 0 ? (
                <p>No doctors found matching your criteria.</p>
              ) : (
                doctors.map((doctor) => (
                    <div className={styles[`doctor-card`]} key={doctor._id}>
                      <Image src={"/Images/images.jpeg"} alt={doctor.name} width={100} height={100}  />
                      <div>
                        <h3>{doctor.name}</h3>
                        <p>Specialization: {doctor.specialization}</p>
                        <p>Location: {doctor.location}</p>
                        <p>Experience: {doctor.experience} years</p>
                        <p>Fees: ₹{doctor.fees}</p>
                        <p>Languages: {doctor.languages.join(", ")}</p>
                        <button>Consult</button>
                      </div>
                    </div>
                ))
              )}
              {/* Pagination Controls */}
              <div className={styles[`pagination-controls`]}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
        <Dialog open={Pane} onClose={() => setPane(false)}>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Doctor's Name"
            name="name"
            value={NewDoc.name}
            onChange={handleInputChange}
            margin="dense"
          />
          <Select
            fullWidth
            name="specialization"
            value={NewDoc.specialization}
            onChange={handleInputChange}
            margin="dense"
          >
            <MenuItem value="">
              <em>Select Specialization</em>
            </MenuItem>
            {Specializations.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            name="location"
            value={NewDoc.location}
            onChange={handleInputChange}
            margin="dense"
          >
            <MenuItem value="">
              <em>Select Location</em>
            </MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            type="number"
            label="Experience (Years)"
            name="experience"
            value={NewDoc.experience}
            onChange={handleInputChange}
            margin="dense"
          />
          <TextField
            fullWidth
            type="number"
            label="Consultation Fee (₹)"
            name="fees"
            value={NewDoc.fees}
            onChange={handleInputChange}
            margin="dense"
          />
          <Select
            fullWidth
            name="language"
            value={NewDoc.language}
            onChange={handleInputChange}
            multiple
            margin="dense"
          >
            {Languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </Select>
          <FormControlLabel
            control={
              <Checkbox
                name="availability"
                checked={NewDoc.availability}
                onChange={handleInputChange}
              />
            }
            label="Available Now"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPane(false)}>Cancel</Button>
          <Button onClick={handleSubmitNewDoctor} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </main>
    </div>
  );
};

export default DoctorsPage;
