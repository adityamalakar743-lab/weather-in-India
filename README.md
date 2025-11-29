# 🌤️ Indian Weather Webpage

A simple, beginner-friendly weather webpage that displays weather information for all Indian state and union territory capitals.

## 📋 What This Project Does

This webpage automatically fetches and displays weather data for 34 Indian capitals, showing:
- **Temperature** (in Celsius)
- **Weather Condition** (sunny, cloudy, rainy, etc.)
- **Humidity** (percentage)
- **Wind Speed** (meters per second)

## 🚀 Quick Start Guide

### Step 1: Get Your Free API Key from OpenWeatherMap

1. **Visit OpenWeatherMap Website**
   - Go to: https://openweathermap.org/
   - Click on **"Sign Up"** (top right corner)

2. **Create a Free Account**
   - Enter your email address
   - Create a username and password
   - Accept the terms and conditions
   - Click **"Create Account"**

3. **Verify Your Email**
   - Check your email inbox
   - Click the verification link sent by OpenWeatherMap

4. **Get Your API Key**
   - After logging in, go to: https://home.openweathermap.org/api_keys
   - You'll see a section called **"API keys"**
   - There should be a default key called **"Default"** - click on it
   - **OR** click **"Create Key"** to generate a new one
   - **Copy the API key** (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

   ⚠️ **Important**: It may take 10-15 minutes for your new API key to activate. If it doesn't work immediately, wait a few minutes and try again.

### Step 2: Add Your API Key to the Project

1. **Open the `script.js` file**
   - You can open it with Notepad, VS Code, or any text editor
   - Find line 7 which says: `const API_KEY = 'YOUR_API_KEY_HERE';`

2. **Replace the API Key**
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - It should look like: `const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';`
   - Make sure to keep the quotes around the API key!

3. **Save the file**
   - Press `Ctrl + S` to save

### Step 3: Run the Project

1. **Open the HTML file**
   - Navigate to the project folder
   - Find the file named `index.html`
   - **Double-click** on `index.html`
   - It will open in your default web browser

2. **View the Weather Data**
   - The webpage will automatically start loading weather data
   - You'll see a "Loading weather data..." message
   - After a few seconds, weather cards for all cities will appear
   - Each card shows temperature, condition, humidity, and wind speed

## 📁 Project Files Explained

- **`index.html`** - The main webpage structure
- **`style.css`** - Styling and design of the webpage
- **`script.js`** - JavaScript code that fetches and displays weather data
- **`README.md`** - This instruction file

## ✏️ How to Add or Remove Cities

### To Add a City:

1. Open `script.js` file
2. Find the `cities` array (around line 12)
3. Add your city name in quotes, followed by a comma
4. Example: To add "Mysore", add `'Mysore',` to the list
5. Save the file and refresh the webpage

### To Remove a City:

1. Open `script.js` file
2. Find the `cities` array
3. Delete the line with the city name you want to remove
4. Save the file and refresh the webpage

**Example of the cities array:**
```javascript
const cities = [
    'Agartala',
    'Aizawl',
    'Bengaluru',
    // Add your city here
    // Remove any city you don't want
];
```

## 🎨 Customizing the Design

### Change Colors:
- Open `style.css`
- Find the `background` property in the `body` section (around line 15)
- Change the gradient colors to your preference

### Change Font Size:
- Open `style.css`
- Find the `font-size` properties and adjust them
- Example: `font-size: 2.5em;` - increase the number to make it bigger

## ❓ Troubleshooting

### Problem: "Please add your OpenWeatherMap API key" error
**Solution**: Make sure you've added your API key in `script.js` file (line 7)

### Problem: "Failed to load weather data" error
**Solutions**:
- Check your internet connection
- Wait 10-15 minutes after creating your API key (it needs time to activate)
- Make sure you copied the API key correctly (no extra spaces)
- Verify your API key at: https://home.openweathermap.org/api_keys

### Problem: Some cities don't show weather data
**Solution**: 
- Some city names might need to be adjusted
- Check the browser console (Press F12) for error messages
- Try using alternative names (e.g., "Bangalore" instead of "Bengaluru")

### Problem: Webpage looks broken or unstyled
**Solution**: 
- Make sure all files (`index.html`, `style.css`, `script.js`) are in the same folder
- Don't rename the files
- Make sure the file names match exactly (case-sensitive)

## 📝 Notes for Beginners

- **HTML** = Structure of the webpage (like the skeleton)
- **CSS** = Styling and appearance (like the clothes)
- **JavaScript** = Functionality and behavior (like the brain)
- **API** = A service that provides data (like a weather service)

## 🔒 Security Note

- Never share your API key publicly
- Don't upload your `script.js` file with the API key to public websites
- The free API key has usage limits, but it's enough for personal use

## 📞 Need Help?

If you encounter any issues:
1. Check that all files are in the same folder
2. Verify your API key is correct
3. Make sure you have an internet connection
4. Try refreshing the webpage (Press F5)

## 🎉 Enjoy!

You now have a working weather webpage! Feel free to customize it and make it your own.

