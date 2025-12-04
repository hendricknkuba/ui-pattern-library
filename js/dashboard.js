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
        let avgViewRows = await d3.csv("data/avg_view_every_year.csv", d => cleanAvgViewRow(d));
        const avgViewData = avgViewRows.flat();

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
        channel_title: row.ChannelName,
        subscribers: +row.followers,      // numeric followers/subscribers
        views: +row.Views,
        likes: +row.Likes,
        category: row.Category || "Unknown",
        country: row.Country || "Unknown"
    };
}

function cleanAvgViewRow(row) {
    const year = +row.year;

    const entries = [];

    // Loop through every column except 'year'
    for (const key in row) {
        if (key !== "year") {
            const value = row[key].trim() === "" ? null : +row[key];

            entries.push({
                year: year,
                channel_title: key,
                avg_views: value
            });
        }
    }

    return entries;
}

// ----------------------------
// 4. SHARED HELPER FUNCTIONS
// Used by all charts in Project 2
// ----------------------------

// Format axis values (ex: 1,500,000 → "1.5M")
function formatLarge(value) {
    return d3.format(".2s")(value).replace("G", "B");
}
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

// Show Back to Top button on scroll
document.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    const btn = document.querySelector(".back-to-top");

    if (scrollY + viewportHeight >= fullHeight * 0.80) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
});

// ----------------------------
// 5. KPI CARD UPDATES (YOUR TOP 3 CARDS)
// ----------------------------
function updateKpiCards(youtubeData) {
    const statCards = document.querySelectorAll(".stats-overview .stat-card");
    if (statCards.length < 3) {
        console.warn("Expected 3 stat cards in .stats-overview, found:", statCards.length);
        return;
    }

    // ---------- Card 1: Most Subscribed Channel ----------
    const topChannel = d3.greatest(youtubeData, d => d.subscribers);
    const card1 = statCards[0];
    const card1Value = card1.querySelector(".stat-value");
    const card1Subtitle = card1.querySelector("span");

    if (topChannel && card1Value) {
        card1Value.textContent = topChannel.channel_title || "N/A";
    }
    if (topChannel && card1Subtitle) {
        card1Subtitle.textContent = `${formatLarge(topChannel.subscribers)} Subscribers`;
    }

    // ---------- Card 2: Country with Most YouTubers ----------
    const countryCounts = d3.rollup(
        youtubeData,
        v => v.length,
        d => d.country
    );
    const countryArray = Array.from(countryCounts, ([country, count]) => ({ country, count }));
    const topCountry = d3.greatest(countryArray, d => d.count);

    const card2 = statCards[1];
    const card2Value = card2.querySelector(".stat-value");
    if (topCountry && card2Value) {
        card2Value.textContent = topCountry.country || "N/A";
    }

    // ---------- Card 3: Top Category by Subscribers ----------
    const categorySubs = d3.rollup(
        youtubeData,
        v => d3.sum(v, d => d.subscribers),
        d => d.category
    );
    const categoryArray = Array.from(categorySubs, ([category, totalSubs]) => ({ category, totalSubs }));
    const topCategory = d3.greatest(categoryArray, d => d.totalSubs);

    const card3 = statCards[2];
    const card3Value = card3.querySelector(".stat-value");
    if (topCategory && card3Value) {
        card3Value.textContent = topCategory.category || "N/A";
    }
}

// ----------------------------
// 6. CONSOLE TESTS (Project 1 requirement)
// ----------------------------
loadData().then(data => {
    if (!data) return;

    console.log("Sample YouTuber Record:", data.youtubeData[1]);
    console.log("Sample Avg View Record:", data.avgViewData[1]);

    console.log("Grouped by Category:", groupBy(data.youtubeData, "category"));
    console.log("Grouped by Country:", groupBy(data.youtubeData, "country"));

    // Update your KPI cards using the loaded data
    updateKpiCards(data.youtubeData);

    // Call existing chart functions (already part of your project)
    chart9_channelMostSubscribers(data.youtubeData);
    chart8_countryWithMostYoutubers(data.youtubeData);
    chart7_categoryMostFollowers(data.youtubeData);
    chart6_categoryByCountry(data.youtubeData);
});
