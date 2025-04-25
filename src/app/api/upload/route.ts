import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try{
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }
            );

            // convert buffer to readable stream and pipe it
            const { Readable } = require('stream');
            Readable.from(buffer).pipe(uploadStream);
        });

        return NextResponse.json({ url: (result as any).secure_url });
    }
    catch(err){
        console.error('Cloudinary upload error:', err);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
