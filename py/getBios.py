# May have to run 'pip3 install requests'
# May have to run 'pip3 install beautifulsoup4'
# python script getPics.py
# downloads images from 'https://www.falkmanfamily.com/photoimages/'
# 
import requests
from bs4 import BeautifulSoup
import os

url = 'https://www.falkmanfamily.com/biograph/'
response = requests.get(url, verify=False)
soup = BeautifulSoup(response.text, 'html.parser')

img_links = [a['href'] for a in soup.find_all('a') if a['href'].endswith(('.jpg', '.jpeg', '.png', '.html'))]

os.makedirs('biograph', exist_ok=True)

downloaded = 0

for link in img_links:
    img_url = url + link
    try:
        img_data = requests.get(img_url, verify=False).content
        with open(f'biograph/{link}', 'wb') as f:
            f.write(img_data)
        downloaded += 1
        print(f"Downloaded: {downloaded} {link}")
    except Exception as e:
        print(f"Failed to download {link}: {e}")

print(f"\n✅ {downloaded} image(s) successfully downloaded.")