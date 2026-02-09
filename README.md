# Autonomous Insurance Claims Processing Agent

A modern, intelligent web application for automated processing of insurance claims documents. Built with React, TypeScript, and advanced document parsing capabilities to streamline the claims intake process.

## 🚀 Features

- **Document Processing**: Support for PDF and text file uploads with intelligent parsing
- **7-Stage Pipeline**: Comprehensive processing pipeline with validation, extraction, and routing
- **Form Field Extraction**: Automatic extraction of form fields from PDF documents
- **Text Normalization**: Advanced text cleaning and normalization
- **Field Extraction**: AI-powered extraction of key claim information (17 fields)
- **Validation Engine**: Data validation with confidence scoring
- **Smart Routing**: Intelligent routing decisions based on claim complexity
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Framer Motion

## 📋 Supported Document Types

- **PDF Files**: Full text extraction and form field parsing
- **Text Files**: Direct text processing
- **Form Fields**: Automatic extraction from fillable PDFs

## 🏗️ Architecture

### State Transitions

![State Transitions Diagram](https://github.com/Abhishek12378956/Autonomous-Insurance-Claims-Processing-Agent-/blob/main/public/state_transitions.png?raw=true)

This diagram illustrates the various states of the application and how it transitions between them based on user actions and the processing pipeline outcomes.

### Processing Pipeline

The application uses a 7-stage processing pipeline:

1. **File Validation**: Verify file format and integrity (PDF/TXT only, 25MB limit)
2. **Document Parsing**: Extract text and metadata from documents
3. **Text Normalization**: Clean and normalize extracted text
4. **Field Extraction**: Extract key claim information using pattern matching
5. **Validation Engine**: Validate extracted data with confidence scoring
6. **Routing Engine**: Determine optimal processing route
7. **Result Formatting**: Format final output for downstream systems

### Extracted Fields (17 Total)

#### Policy Information
- Policy Number
- Policyholder Name
- Policy Effective Date
- Policy Expiry Date

#### Incident Information
- Incident Date
- Incident Time
- Location
- Description
- Claim Type

#### Involved Parties
- Claimant Name
- Claimant Contact
- Third Parties

#### Asset Details
- Asset Type
- Asset ID (VIN/Serial)

#### Financial Information
- Estimated Damage
- Initial Estimate

#### Other Information
- Has Injury
- Attachments

### Key Components

- **PDF Parser**: Uses `pdf-lib` for form field extraction and `pdf-parse` for text processing
- **Pipeline Orchestrator**: Manages the 7-stage processing workflow
- **Validation Engine**: Ensures data quality and completeness
- **Routing Engine**: Makes intelligent routing decisions
- **Modern UI**: React-based interface with real-time progress tracking

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library
- **React Hook Form**: Form handling and validation
- **React Dropzone**: File upload component
- **React Query**: Data fetching and caching

### Document Processing
- **pdf-lib**: PDF manipulation and form field extraction
- **pdf-parse**: PDF text extraction
- **Custom parsers**: Specialized text processing

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing

## 📦 Installation

### Prerequisites

- Node.js (version 20.16.0 < 21 or >= 22.3.0)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autonomous-insurance-claims-processing-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

This starts the Vite development server with hot module replacement. The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

### Linting

```bash
npm run lint
```

Run ESLint to check code quality and formatting.

## 📁 Project Structure

```
src/
├── app/                    # Main application components
├── assets/                 # Static assets (images, etc.)
├── components/             # Reusable UI components
│   ├── Badge.tsx          # Status badges
│   ├── Card.tsx           # Card components
│   ├── Loader.tsx         # Loading indicators
│   └── SectionHeader.tsx  # Section headers
├── hooks/                  # Custom React hooks
├── modules/                # Feature modules
│   ├── upload/            # Document upload and status handling
│   └── claim-analysis/    # Analysis results, routing decisions
├── services/               # Business logic and services
│   ├── parsers/           # Document parsing services
│   │   └── pdfParser.ts   # PDF parsing implementation
│   └── pipeline/          # Processing pipeline
│       ├── index.ts       # Pipeline orchestrator
│       └── stages/        # Individual pipeline stages
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
│   ├── claim.types.ts     # Claim-related types
│   └── pipeline.types.ts  # Pipeline-related types
├── utils/                  # Utility functions
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

## 🔧 Configuration

### Environment Variables

The application uses standard Vite environment variables. Create a `.env.local` file in the root directory for local configuration:

```env
# Add your environment variables here
```

### Build Configuration

- **Vite Config**: `vite.config.ts`
- **TypeScript Config**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Tailwind Config**: `tailwind.config.ts`
- **ESLint Config**: `eslint.config.js`

## 📝 Usage Guide

### Processing a Claim

1. **Upload Document**: Click the upload area or drag and drop a PDF or text file
2. **Automatic Processing**: The document goes through the 7-stage pipeline automatically
3. **View Results**: See extracted fields, validation results, and routing decisions
4. **Review Confidence**: Check confidence scores for each extracted field

### User Experience Flow

#### Upload Flow
1. **Drag & Drop** - Upload PDF/TXT files
2. **Processing** - Real-time status updates with progress indicators
3. **Extraction Preview** - Key-value pairs display showing all 17 extracted fields
4. **Full Analysis** - Complete results with routing decisions and confidence scores

#### Navigation
- **Extraction Preview** → Shows all 17 extracted fields with confidence scores
- **"View Full Analysis"** → Detailed analysis page with routing decisions
- **"Process Another"** → Reset to upload new document

### File Validation

#### Supported Files
- **PDF files** (.pdf) - Full text extraction and form field parsing
- **TXT files** (.txt) - Direct text reading
- **All other formats** - Rejected with clear error messages

#### Validation Rules
- File extension check (.pdf, .txt only)
- MIME type validation (application/pdf, text/plain)
- Size limit: 25MB maximum
- Empty file detection
- Extension/MIME type cross-validation

### Routing Decisions

The system automatically routes claims to appropriate processing queues:

- **FAST_TRACK**: Simple claims with complete information
- **STANDARD_REVIEW**: Claims requiring standard review
- **MANUAL_REVIEW**: Claims needing human intervention
- **SPECIALIST_QUEUE**: Claims requiring specialist expertise
- **INVESTIGATION**: Claims requiring further investigation

## 🧪 Testing

### Sample Document Format

For testing purposes, use documents with the following format:

```
Policy Number: POL-123456789
Policyholder Name: John Michael Smith
Policy Effective Date: 01/01/2024
Policy Expiry Date: 12/31/2024
Date of Loss: 02/15/2024
Time of Incident: 2:30 PM
Location: 123 Main St, City
Description: Vehicle accident occurred at intersection...
Claim Type: Auto
Claimant: John Michael Smith
Contact: (555) 123-4567
Third Party: Jane Doe
Asset Type: Vehicle
Asset ID: 1HGCM82633A123456
Estimated Damage: $5,000
Initial Estimate: $4,500
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- Unit tests for individual pipeline stages
- Integration tests for the complete pipeline
- Component tests for UI elements

## 🐛 Troubleshooting

### Common Issues

1. **"View Full Analysis" button not working**
   - Check browser console for hash change logs
   - Ensure `state === 'success'` and `result` exists

2. **File upload rejected**
   - Verify file is PDF or TXT format
   - Check file size is under 25MB
   - Ensure file is not corrupted

3. **Missing fields in extraction**
   - Ensure document contains required keywords
   - Check text quality and formatting
   - Verify field names match expected patterns

4. **PDF Parsing Errors**
   - Ensure PDF files are not password-protected
   - Check that PDF files are not corrupted
   - Verify file size is within reasonable limits

5. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

6. **Development Server Issues**
   - Check if port 5173 is available
   - Try restarting the development server
   - Clear browser cache

### Debug Mode

Enable debug logging by opening the browser console (F12) and looking for:
- 🔍 Debug messages
- Pipeline stage logs
- Processing status updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Development Guidelines

- Follow the existing pipeline pattern for new features
- Use the established component structure
- Maintain type safety with TypeScript
- Write comprehensive tests
- Document new functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Dependencies

### Key Dependencies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **pdf-lib**: PDF manipulation
- **pdf-parse**: PDF text extraction
- **Framer Motion**: Animations
- **React Query**: State management

### Development Dependencies

- **ESLint**: Code quality
- **TypeScript Compiler**: Type checking
- **Vite**: Development server and build tool

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation
- Examine the debug console for detailed error messages

## 🗺️ Roadmap

### Future Enhancements

- [ ] Add support for more document formats (DOCX, images)
- [ ] Implement machine learning for field extraction
- [ ] Add real-time collaboration features
- [ ] Implement advanced analytics dashboard
- [ ] Add multi-language support
- [ ] Integration with external claims management systems
- [ ] OCR for image-based PDFs
- [ ] Batch processing capabilities
- [ ] Advanced routing rules engine
- [ ] Performance analytics and monitoring

### Potential Improvements

- AI/ML-based field extraction for higher accuracy
- Advanced validation rules with custom business logic
- Integration with external APIs for data enrichment
- Real-time collaboration between claim handlers
- Mobile application for field agents
- Advanced reporting and analytics

---

**Built with ❤️ using modern web technologies**

**Current Status: FULLY IMPLEMENTED & WORKING** ✅

All features are complete and tested. The application is ready for production use.
