require("dotenv").config();

const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());

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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
