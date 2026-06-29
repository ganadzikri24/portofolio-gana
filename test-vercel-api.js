

async function check() {
    const payload = {
        title: "test api",
        title_id: "test api",
        category: "Lainnya",
        category_id: "Lainnya",
        type: "article",
        description: "test",
        description_id: "test",
        videoUrl: "",
        tools: ["React"],
        thumbnail: "https://test.com/thumb.jpg",
        images: [],
        content: [
            { type: "image", value: "https://test.com/1.jpg" },
            { type: "image", value: "https://test.com/2.jpg" }
        ],
        content_id: [
            { type: "image", value: "https://test.com/1.jpg" },
            { type: "image", value: "https://test.com/2.jpg" }
        ],
        is_hidden: true,
        order_index: 999
    };
    
    try {
        const res = await fetch("https://portofolio-gana.vercel.app/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
check();
