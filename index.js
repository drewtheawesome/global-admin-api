require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});