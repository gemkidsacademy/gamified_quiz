import { useEffect, useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

export default function GenerateGamifiedQuizzes() {

    const [category, setCategory] = useState("");
    const [classYear, setClassYear] = useState("");
    const [classDay, setClassDay] = useState("");
    const [session, setSession] = useState("");

    const [topic, setTopic] = useState("");
    const [activityType, setActivityType] = useState("");

    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [classDays, setClassDays] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [classYears, setClassYears] = useState([]);
    const server = process.env.REACT_APP_API_BASE;


const handleGenerate = async () => {

    try {

        const response = await fetch(

            `${server}/admin/gamified/generate-quiz`,

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    category,

                    class_year: classYear,

                    class_day: classDay,

                    session: Number(session),

                    activity_type: activityType,

                    topic,

                }),

            }

        );

        const data = await response.json();

        if (response.ok) {

            setMessage(data.message);

        }
        else {

            alert(data.detail);

        }

    }
    catch (err) {

        console.error(err);

        alert("Failed to generate quiz.");

    }

};
    useEffect(() => {

        loadCategories();

        loadSessions();

    }, []);
    async function loadSessions() {

    try {

        const response = await fetch(

            `${server}/admin/gamified/sessions`

        );

        const data = await response.json();

        if (response.ok) {

            setSessions(data.sessions);

        }

    }
    catch (err) {

        console.error(err);

    }

}
    async function loadClassDays(selectedCategory, selectedClassYear) {

    try {

        const response = await fetch(

            `${server}/admin/gamified/class-days`,

            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({

                    category: selectedCategory,

                    class_year: selectedClassYear,

                }),

            }

        );

        const data = await response.json();

        if (response.ok) {

            setClassDays(data.class_days);

        }

    }
    catch (err) {

        console.error(err);

    }

}
    async function loadClassYears(selectedCategory) {

    try {

        const response = await fetch(

            `${server}/admin/gamified/class-years`,

            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    category: selectedCategory,
                }),
            }

        );

        const data = await response.json();

        if (response.ok) {

            setClassYears(data.class_years);

        }

    }
    catch (err) {

        console.error(err);

    }

}
    async function loadCategories() {

        try {

            const response = await fetch(

                `${server}/admin/gamified/categories`

            );

            const data = await response.json();

            if (response.ok) {

                setCategories(data.categories);

            }

        }
        catch (err) {

            console.error(err);

        }

    }

    return (

        <Paper
            sx={{
                p:4,
                maxWidth:700,
                mx:"auto",
                mt:3,
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
            >
                Generate Gamified Quizzes
            </Typography>

            <TextField
                fullWidth
                label="Category"
                select
                margin="normal"
                value={category}
                onChange={(e) => {

                    const value = e.target.value;

                    setCategory(value);

                    setClassYear("");
                    setClassDay("");
                    setSession("");

                    setClassYears([]);
                    setClassDays([]);

                    loadClassYears(value);

                }}
            >

                {
                    categories.map((item) => (

                        <MenuItem
                            key={item}
                            value={item}
                        >
                            {item}
                        </MenuItem>

                    ))
                }

            </TextField>

            <TextField
                fullWidth
                label="Class Year"
                select
                margin="normal"
                value={classYear}
                onChange={(e) => {

                    const value = e.target.value;

                    setClassYear(value);

                    setClassDay("");
                    setSession("");

                    setClassDays([]);

                    loadClassDays(category, value);

                }}
            >

                {
                    classYears.map((item) => (

                        <MenuItem
                            key={item}
                            value={item}
                        >
                            {item}
                        </MenuItem>

                    ))
                }

            </TextField>

            <TextField
                fullWidth
                label="Class Day"
                select
                margin="normal"
                value={classDay}
                onChange={(e) => setClassDay(e.target.value)}
            >

                {
                    classDays.map((item) => (

                        <MenuItem
                            key={item}
                            value={item}
                        >
                            {item}
                        </MenuItem>

                    ))
                }

            </TextField>

            <TextField
                fullWidth
                label="Session"
                select
                margin="normal"
                value={session}
                onChange={(e) => setSession(e.target.value)}
            >

                {
                    sessions.map((item) => (

                        <MenuItem
                            key={item}
                            value={item}
                        >
                            Session {item}
                        </MenuItem>

                    ))
                }

            </TextField>

            <TextField
                fullWidth
                margin="normal"
                label="Activity Type"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />

            <Box mt={3}>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGenerate}
                >
                    Generate Quiz
                </Button>

            </Box>

            {
                message &&
                <Alert
                    sx={{mt:3}}
                    severity="success"
                >
                    {message}
                </Alert>
            }

        </Paper>

    );

}