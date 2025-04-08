# Modern Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Vite, and Tailwind CSS. Features an interactive 3D design, dark mode support, and smooth animations.

![Portfolio Preview](preview.png)

## ✨ Features

- **Modern Design**: Clean and professional UI with attention to detail
- **Interactive 3D Elements**: Engaging user experience with 3D transformations
- **Dark/Light Mode**: Seamless theme switching with persistent user preference
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Performance Optimized**: Built with performance best practices
- **TypeScript Support**: Full type safety and better developer experience

## 🚀 Tech Stack

- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [PostCSS](https://postcss.org/) - CSS Processing

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-website.git
```

2. Navigate to the project directory:
```bash
cd portfolio-website
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 🎨 Customization

### Personal Information
Update your personal information in the following files:
- `src/components/LandingPage.tsx` - Main content and hero section
- `src/components/Footer.tsx` - Contact information and social links

### Styling
- Theme colors can be customized in `tailwind.config.js`
- Animations and transitions can be modified in the CSS sections of `LandingPage.tsx`

### Projects
Add or modify your projects in the `projects` array within `LandingPage.tsx`:
```typescript
const projects = [
  { 
    name: 'Project Name',
    tags: ['Tag1', 'Tag2', 'Tag3']
  },
  // Add more projects...
];
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop screens
- Large displays

## ⚡ Performance

- Optimized asset loading
- Efficient state management
- Hardware-accelerated animations
- Lazy loading of components
- Minimized bundle size

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/portfolio-website/issues).

## 📧 Contact

Dendi Rivaldi - rivaldydendy@gmail.com

Project Link: [https://github.com/yourusername/portfolio-website](https://github.com/yourusername/portfolio-website)

---
Made with ❤️ by [Dendi Rivaldi](https://github.com/rivaldydendy)
