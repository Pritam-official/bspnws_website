import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const originalUrl = searchParams.get("url");

        if (!originalUrl) {
            return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
        }

        let downloadUrl = originalUrl;

        // Check if it is a Google Drive link
        if (originalUrl.includes("drive.google.com")) {
            let fileId = "";
            const fileIdMatch = originalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                fileId = fileIdMatch[1];
            } else {
                const idParamMatch = originalUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                if (idParamMatch && idParamMatch[1]) {
                    fileId = idParamMatch[1];
                }
            }

            if (fileId) {
                downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
            }
        }

        const response = await fetch(downloadUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch file from remote source: ${response.statusText}` }, { status: response.status });
        }

        const pdfBuffer = await response.arrayBuffer();

        const headers = new Headers();
        headers.set("Content-Type", "application/pdf");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Content-Disposition", "inline");

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers
        });
    } catch (error: any) {
        console.error("PDF Proxy Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
