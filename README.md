# Autonomous Insurance Claims Processing Agent

An intelligent First Notice of Loss (FNOL) processing system designed to automate claim intake, document analysis, and routing decisions. This application leverages modern web technologies to provide a seamless experience for claim handlers and automated systems.

## Current Status: **FULLY IMPLEMENTED & WORKING**

All Features Complete:
- PDF & TXT file upload with validation
- 17-field extraction from FNOL documents
- Real-time extraction preview with key-value pairs
- Full analysis page with confidence scores
- Intelligent routing decisions
- Complete validation engine
- Beautiful UI with animations

## Extracted Fields (17 Total)

### Policy Information
- Policy Number
- Policyholder Name  
- Policy Effective Date
- Policy Expiry Date

### Incident Information
-  Incident Date
-  Incident Time
-  Location
-  Description
-  Claim Type

### Involved Parties
-  Claimant Name
-  Claimant Contact
-  Third Parties

### Asset Details
-  Asset Type
-  Asset ID (VIN/Serial)

### Financial Information
-  Estimated Damage
-  Initial Estimate

### Other Information
-  Has Injury
-  Attachments

## Technology Stack

- **Core**: React 19, TypeScript, JavaScript ES6+ logic
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **PDF Processing**: PDF.js
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/       # Reusable UI components (Card, Button, etc.)
├── modules/          # Feature-based modules
│   ├── upload/       # Document upload and status handling
│   └── claim-analysis/ # Analysis results, routing decisions
├── services/         # API integration and parsers (PDF)
│   └── pipeline/     # 7-stage processing pipeline
├── styles/           # Global styles and tailwind config
└── types/            # TypeScript definitions
```

##  Processing Pipeline (7 Stages)

1. **File Validation** - PDF/TXT only, 25MB limit
2. **Document Parsing** - PDF.js for PDFs, native for TXT
3. **Text Normalization** - Clean and normalize text
4. **Field Extraction** - Extract 17 fields with confidence
5. **Validation Engine** - Validate extracted data
6. **Routing Engine** - Determine claim routing
7. **Result Formatting** - Format for UI display

##  User Experience

### Upload Flow
1. **Drag & Drop** - Upload PDF/TXT files
2. **Processing** - Real-time status updates
3. **Extraction Preview** - Key-value pairs display
4. **Full Analysis** - Complete results with routing

### Navigation
- **Extraction Preview** → Shows all 17 extracted fields
- **"View Full Analysis"** → Detailed analysis page
- **"Process Another"** → Reset to upload

##  File Validation

### Supported Files
-  **PDF files** (.pdf) - Full text extraction
-  **TXT files** (.txt) - Direct text reading
-  **All other formats** - Rejected with error messages

### Validation Rules
- File extension check (.pdf, .txt only)
- MIME type validation (application/pdf, text/plain)
- Size limit: 25MB maximum
- Empty file detection
- Extension/MIME type cross-validation

##  Testing

### Test Document Format
```
Policy Number: POL-123456789
Policyholder Name: John Michael Smith
Policy Effective Date: 01/01/2024
Policy Expiry Date: 12/31/2024
Date of Loss: 02/15/2024
Time of Incident: 2:30 PM
Location: 123 Main St, City
Description: Vehicle accident occurred...
Claim Type: Auto
Claimant: John Michael Smith
Contact: (555) 123-4567
Third Party: Jane Doe
Asset Type: Vehicle
Asset ID: 1HGCM82633A123456
Estimated Damage: $5,000
Initial Estimate: $4,500
```

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### Implemented Features
- **File Upload**: Drag & drop PDF/TXT files
- **Field Extraction**: 17 fields with confidence scores
- **Real-time Preview**: Key-value pairs display
- **Validation**: Comprehensive data validation
- **Routing Logic**: Intelligent claim routing
- **Error Handling**: Graceful error management
- **Responsive Design**: Mobile-friendly interface
- **Animations**: Smooth transitions with Framer Motion

###  Technical Features
- **TypeScript**: Full type safety
- **React Query**: Async state management
- **PDF.js**: PDF text extractio
- **Tailwind CSS**: Modern styling
- **Modular Architecture**: Clean, maintainable code
- **Pipeline Pattern**: 7-stage processing

##  Troubleshooting

### Common Issues
1. **"View Full Analysis" button not working**
   - Check browser console for hash change logs
   - Ensure `state === 'success'` and `result` exists

2. **File upload rejected**
   - Verify file is PDF or TXT format
   - Check file size is under 25MB

3. **Missing fields in extraction**
   - Ensure document contains required keywords
   - Check text quality and formatting

### Debug Mode
- Open browser console (F12)
- Look for 🔍 debug messages
- Check pipeline stage logs

##  Development Notes

### Key Components
- **FileDropzone**: Handles file upload with validation
- **ExtractionPreview**: Shows key-value pairs
- **ClaimResultPage**: Full analysis display
- **ExtractedFieldsPanel**: Field display with confidence

### Pipeline Stages
- **validateFile**: File type and size validation
- **parseDocument**: PDF/TXT text extraction
- **extractFields**: 17-field extraction with regex
- **validationEngine**: Data validation and consistency
- **routingEngine**: Claim routing decisions

##  Future Enhancements

### Potential Improvements
- AI/ML-based field extraction
- OCR for image-based PDFs
- Batch processing capabilities
- Advanced routing rules
- Integration with external systems
- Performance analytics dashboard

##  License

This project is for demonstration and educational purposes.

---

** Ready to Use: All features implemented and tested!**
