#!/usr/bin/env python3
"""
Generate AI-powered header image for login screen using OpenAI-compatible API.
Saves the generated image to assets/images/login-header.png
"""

import base64
import re
import sys
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("ERROR: openai package not installed. Install with: pip install openai")
    sys.exit(1)


def extract_image_data(content):
    """
    Extract binary image data from various response formats:
    - Pure base64 string
    - Data URL (data:image/png;base64,...)
    - Markdown image with base64 (![...](data:image/...))
    - URL to download
    """
    if not content:
        return None, "Empty content"

    # Check if it's a data URL
    data_url_match = re.search(r"data:image/[^;]+;base64,([A-Za-z0-9+/=]+)", content)
    if data_url_match:
        b64_data = data_url_match.group(1)
        try:
            return base64.b64decode(b64_data), None
        except Exception as e:
            return None, f"Failed to decode data URL: {e}"

    # Check if it's a markdown image with data URL
    md_match = re.search(r"!\[.*?\]\((data:image/[^)]+)\)", content)
    if md_match:
        return extract_image_data(md_match.group(1))

    # Check if content looks like pure base64 (no spaces, only base64 chars)
    if re.match(r"^[A-Za-z0-9+/=\s]+$", content.strip()):
        # Remove any whitespace
        b64_clean = re.sub(r"\s", "", content)

        # Fix padding if needed
        padding = 4 - (len(b64_clean) % 4)
        if padding != 4:
            b64_clean += "=" * padding

        try:
            data = base64.b64decode(b64_clean)
            # Verify it looks like an image (check magic bytes)
            if data[:4] == b"\x89PNG" or data[:2] == b"\xff\xd8":  # PNG or JPEG
                return data, None
            else:
                return (
                    None,
                    f"Decoded data doesn't look like an image (magic bytes: {data[:4].hex()})",
                )
        except Exception as e:
            return None, f"Failed to decode base64: {e}"

    # If it's a URL, we'd need to download it
    if content.startswith("http://") or content.startswith("https://"):
        try:
            import urllib.request

            with urllib.request.urlopen(content, timeout=30) as response:
                return response.read(), None
        except Exception as e:
            return None, f"Failed to download from URL: {e}"

    return None, f"Unknown content format (first 100 chars): {content[:100]}"


def validate_image(data):
    """Check if data is a valid PNG or JPEG image."""
    if len(data) < 8:
        return False, "Data too small"

    # Check PNG magic bytes
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return True, "PNG"

    # Check JPEG magic bytes
    if data[:2] == b"\xff\xd8":
        return True, "JPEG"

    return False, f"Unknown format (magic: {data[:8].hex()})"


def generate_login_image():
    """Generate and save the login header image."""

    # Initialize OpenAI client with custom endpoint
    client = OpenAI(
        base_url="http://127.0.0.1:8045/v1",
        api_key="sk-e42b639c53274e9f90ce9693ad1c3f81",
    )

    # Image generation prompt
    prompt = "Warm watercolor illustration of a loving parent holding a happy toddler, soft pastel colors with forest green and cream tones, nurturing growth theme, organic shapes, children's book illustration style, no text"

    print("Generating login header image...")
    print(f"Prompt: {prompt}")
    print("Size: 1280x720 (16:9)")

    try:
        # Call the API
        response = client.chat.completions.create(
            model="gemini-3-pro-image",
            extra_body={"size": "1280x720"},
            messages=[{"role": "user", "content": prompt}],
        )

        # Get the response content
        content = response.choices[0].message.content
        if not content:
            print("\n[ERROR] API returned empty response")
            return False

        print(f"\nResponse received ({len(content)} chars)")

        # Debug: show first 200 chars of response
        print(f"Response preview: {content[:200]}...")

        # Extract image data
        image_data, error = extract_image_data(content)
        if error:
            print(f"\n[ERROR] Could not extract image: {error}")
            return False

        # Validate image
        is_valid, img_format = validate_image(image_data)
        if not is_valid:
            print(f"\n[ERROR] Invalid image data: {img_format}")
            return False

        print(f"Image format: {img_format}")

        # Create output directory if needed
        output_dir = Path("assets/images")
        output_dir.mkdir(parents=True, exist_ok=True)

        # Always save as jpg since the API returns JPEG
        output_path = output_dir / "login-header.jpg"

        # Save image
        with open(output_path, "wb") as f:
            f.write(image_data)

        # Verify file was created
        file_size = output_path.stat().st_size
        print(f"\n[SUCCESS] Image generated and saved")
        print(f"  Location: {output_path.absolute()}")
        print(f"  Size: {file_size:,} bytes ({file_size / 1024:.1f} KB)")
        print(f"  Format: {img_format}")

        if file_size < 10240:
            print(f"  WARNING: File size is small ({file_size / 1024:.1f} KB)")

        return True

    except ConnectionError as e:
        print(f"\n[ERROR] Connection failed")
        print(f"  Could not connect to API at http://127.0.0.1:8045/v1")
        print(f"  Details: {e}")
        return False

    except Exception as e:
        print(f"\n[ERROR] Unexpected error")
        print(f"  {type(e).__name__}: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = generate_login_image()
    sys.exit(0 if success else 1)
