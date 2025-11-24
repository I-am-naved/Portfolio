# Certificates Folder

Place your certificate images in this folder.

## How to Add Your Certificates

1. **Save your certificate images** in this `certificates` folder
2. **Name them** as:
   - `certificate1.jpg` (or .png, .jpeg)
   - `certificate2.jpg`
   - `certificate3.jpg`
   - etc.

3. **Update the HTML** in `index.html`:
   - Find the Certificates & Awards section
   - Update the `src` attribute for each certificate image
   - Update the certificate name, organization, and date

## Supported Image Formats
- JPG/JPEG
- PNG
- WebP

## Tips
- Use high-resolution images for best quality
- Recommended aspect ratio: 4:3 or 3:2 (landscape orientation)
- Optimize images for web to keep file sizes reasonable
- You can add more certificate items by copying the certificate-item div structure

## Example Structure
```html
<div class="certificate-item">
    <div class="certificate-image-wrapper">
        <img src="certificates/your-certificate.jpg" alt="Certificate" class="certificate-image">
        <div class="certificate-overlay">
            <div class="certificate-info">
                <h5>Your Certificate Name</h5>
                <p>Issuing Organization</p>
                <span class="certificate-date">2024</span>
            </div>
        </div>
    </div>
</div>
```

