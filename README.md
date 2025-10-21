# 🧶 Knitter (Knit pattern reader)

> 청년취업사관학교 새싹(SeSAC) 풀스택 과정 - 프로젝트 2<br>
> 2025.10 ~

## 🎯 Project Info
> A minimalist app for tracking knitting patterns with size-specific instructions and progress checkboxes

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 📄 **Upload Patterns** - Support for .txt, .pdf, .docx, .md files
- 📏 **Size Selection** - Automatically extract and display size-specific stitch counts
- ✅ **Progress Tracking** - Check off steps as you complete them
- 💾 **Auto Save** - Your progress is saved locally
- 📱 **Responsive** - Works on mobile, tablet, and desktop

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React Hooks
- **Drag & Drop**: dnd-kit

### Backend
- **Framework**: Next.js API Routes
- **Database**: MySQL
- **ORM**: Prisma 6.15

### Development Tools
- **Code Quality**: Biome (Linter & Formatter)
- **Container**: Docker Compose
- **Package Manager**: pnpm

## 🚀 Quick Start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Use Case

Perfect for knitters who:
- Work with complex written patterns
- Get confused by multiple size options
- Want to track their progress
- Need a simple, distraction-free tool