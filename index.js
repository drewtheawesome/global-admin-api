require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("HAS_KEY:", !!process.env.SUPABASE_KEY);


// CHECK IF PLAYER IS BANNED
app.get("/ban/:userid", async (req, res) => {
    const { data } = await supabase
        .from("bans")
        .select("userid")
        .eq("userid", req.params.userid)
        .maybeSingle();

    res.json({
        banned: data !== null
    });
});


// BAN PLAYER
app.post("/ban", async (req, res) => {
    const userid = req.body.userid;

    const { error } = await supabase
        .from("bans")
        .insert({
            userid: userid
        });

    if (error) {
        return res.json({
            success: false,
            error: error.message
        });
    }

    res.json({
        success: true
    });
});


// UNBAN PLAYER
app.delete("/ban/:userid", async (req, res) => {

    const { error } = await supabase
        .from("bans")
        .delete()
        .eq("userid", req.params.userid);

    if (error) {
        return res.json({
            success: false,
            error: error.message
        });
    }

    res.json({
        success: true
    });
});


// CHECK IF USER IS ADMIN
app.get("/admin/:userid", async (req, res) => {
    // FIX: Pass the raw string directly. Supabase handles the int8 string conversion safely.
    // Alternatively, use BigInt(req.params.userid).toString() to prevent JS float corruption.
    const targetUserId = req.params.userid;

    const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("userid", targetUserId) 
        .maybeSingle();

    console.log("Incoming raw text userid:", req.params.userid);
    console.log("Supabase response data:", data);
    if (error) console.error("Supabase error:", error);

    res.json({
        admin: data !== null
    });
});



app.listen(3000, () => {
    console.log("Server running on port 3000");
});
