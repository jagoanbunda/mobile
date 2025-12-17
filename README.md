# KREANOVA Mobile App

A React Native mobile application built with Expo for tracking child nutrition, growth, developmental screening (ASQ-3), and PMT (Pemberian Makanan Tambahan) program management.

## Features

- **📊 Dashboard** - Overview of child's health status and pending tasks
- **🍽️ Food Input** - Log daily meals with Indonesian date picker and nutrition summary table
- **📈 Growth Tracking** - Record and monitor anthropometric measurements (height/weight)
- **🧠 ASQ-3 Screening** - Developmental screening questionnaire for children
- **🥗 PMT Tracking** - Track supplementary food program consumption

## Screenshots

### Main Screens

| Home | Food Input | Progress |
|:---:|:---:|:---:|
| ![Home](assets/screenshots/home.png) | ![Food Input](assets/screenshots/food_input.png) | ![Progress](assets/screenshots/progress.png) |

### Anthropometry

| Input | History |
|:---:|:---:|
| ![Anthropometry Input](assets/screenshots/anthropometry_input.png) | ![Anthropometry History](assets/screenshots/anthropometry_history.png) |

### ASQ-3 Screening

| Index | Questionnaire | Result |
|:---:|:---:|:---:|
| ![Screening Index](assets/screenshots/screening_index.png) | ![Screening Questionnaire](assets/screenshots/screening_questionnaire.png) | ![Screening Result](assets/screenshots/screening_result.png) |

### PMT (Pemberian Makanan Tambahan)

| Index | Report | History |
|:---:|:---:|:---:|
| ![PMT Index](assets/screenshots/pmt_index.png) | ![PMT Report](assets/screenshots/pmt_report.png) | ![PMT History](assets/screenshots/pmt_history.png) |

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with Material Icons
- **Date Picker**: @react-native-community/datetimepicker

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open in development:
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go)

## Project Structure

```
app/
├── (tabs)/            # Tab-based navigation screens
│   ├── index.tsx      # Dashboard/Home
│   ├── input.tsx      # Food input
│   ├── progress.tsx   # Growth progress
│   ├── screening.tsx  # ASQ-3 screening
│   └── pmt.tsx        # PMT tracking
├── anthropometry/     # Anthropometry screens
├── screening/         # ASQ-3 questionnaire & results
├── pmt/               # PMT report screens
├── profile/           # Parent/child profile management
└── auth/              # Authentication screens
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
