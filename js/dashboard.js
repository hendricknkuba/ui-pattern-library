/*  
==========================================
   DASHBOARD JS – DATA ENGINEER (James)
   Project 1 – D3 Setup + Data Handling
==========================================
*/

// ----------------------------
// 1. GLOBAL COLOR SYSTEM
// Matches pattern-library color palette
// ----------------------------
const brandColors = {
    red: "#D72638",
    blue: "#1B3B6F",
    yellow: "#F4D35E",
    neutral: "#F5F5F5",
    dark: "#111111"
};

// A color scale used by some charts later
const categoryColor = d3.scaleOrdinal()
    .range([brandColors.red, brandColors.blue, brandColors.yellow]);


// ----------------------------
// 2. LOAD DATA (CSV IMPORT)
// top_100_youtubers.csv
// avg_view_every_year.csv
// ----------------------------
async function loadData() {
    try {
        const youtubeData = await d3.csv("data/top_100_youtubers.csv", d => cleanYouTubeRow(d));
        const avgViewData = await d3.csv("data/avg_view_every_year.csv", d => cleanAvgViewRow(d));

        console.log("✔ Data Loaded Successfully:");
        console.log("YouTubers:", youtubeData.length, "rows");
        console.log("Avg Views:", avgViewData.length, "rows");

        return { youtubeData, avgViewData };

    } catch (error) {
        console.error("❌ Error loading data:", error);
    }
}


// ----------------------------
// 3. CLEANING FUNCTIONS
// Convert strings → numbers, handle missing values
// ----------------------------
function cleanYouTubeRow(row) {
    return {
        channel_title: row.channel_title,
        subscribers: +row.subscribers,
        views: +row.views,
        likes: +row.likes,
        category: row.category || "Unknown",
        country: row.country || "Unknown"
    };
}

function cleanAvgViewRow(row) {
    return {
        channel_title: row.channel_title,
        year: +row.year,
        avg_views: +row.avg_views
    };
}


// ----------------------------
// 4. SHARED HELPER FUNCTIONS
// Used by all charts in Project 2
// ----------------------------

// Format axis values (ex: 1,500,000 → "1.5M")
const formatLargeNumber = d3.format(".2s");

// Format regular numbers
const formatComma = d3.format(",");

// Group data by column
function groupBy(data, key) {
    return d3.group(data, d => d[key]);
}

// Optional: Responsive SVG
function makeResponsive(svg) {
    svg.attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", `0 0 ${svg.attr("width")} ${svg.attr("height")}`);
}


// ----------------------------
// 5. CHART FUNCTION PLACEHOLDERS
// Created by Devs 3, 4, 5 in Project 2
// ----------------------------

function chart1_proportionCategories(data) {
    // TODO: Chart developer will build this in Project 2
}

function chart2_likesVsSubscribers(data) {
    // TODO: Brushing added by Hendrick in Project 2
}

function chart3_youtubersPerCountry(data) {
    // TODO
}

function chart4_top5ChannelsByYear(data) {
    // TODO
}

function chart5_quarterlyIncome(data) {
    // TODO
}

function chart6_categoryByCountry(data) {
    // TODO: Interactive filtering
}

function chart7_categoryMostFollowers(data) {
    // TODO 
}

function chart8_countryWithMostYoutubers(data) {
    // TODO
}

function chart9_channelMostSubscribers(data) {
    // TODO
}


// ----------------------------
// 6. CONSOLE TESTS (Project 1 requirement)
// Run this file and verify that D3 loads data correctly
// ----------------------------
loadData().then(data => {
    if (!data) return;

    console.log("Sample YouTuber Record:", data.youtubeData[0]);
    console.log("Sample Avg View Record:", data.avgViewData[0]);

    console.log("Grouped by Category:", groupBy(data.youtubeData, "category"));
    console.log("Grouped by Country:", groupBy(data.youtubeData, "country"));
});

