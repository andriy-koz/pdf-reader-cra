# HSG LASER TRACER

#### Video Demo:  <https://youtu.be/3tbC8TfGZG0>

#### Description:
HSG Laser Tracer is a web-based application developed using React that provides insightful analytics on machined pieces. It processes information from uploaded PDFs, extracting relevant data for summarization and visualization. This tool focuses on efficiency in data extraction and processing using modern web technologies.

#### Overview:
At its core, the HSG Laser Tracer is a web application using the React library. The application leverages modern JavaScript features and React hooks for state management and side effects, such as useState and useEffect. It also takes advantage of the react-router-dom library to manage the application's routing.

The application utilizes the pdfjs-dist library to handle PDF processing, extracting text content from uploaded files. All text manipulation is done using JavaScript's built-in string and regular expression operations.

#### The application is split into several main parts:
- The App component (located in /src/App.js), which is the root component of the application. This component manages the file upload process and navigation through the application.
- The Home component (located in /src/components/Home.js), which serves as the landing page for the application. From here, users can upload their PDF files.
- The PDFRenderer component (located in /src/components/PDFRenderer.js), which is responsible for rendering data and analytics based on the uploaded PDF file.
- The usePDFProcessing hook (located in /src/hooks/usePDFProcessing.js), which encapsulates the logic for processing the PDF file and extracting the necessary data.
- The utility functions (located in /src/utils.js), which contain various helper functions used throughout the application.

#### Detailed Breakdown:
In terms of data extraction and processing, the application operates in a sequence of defined steps:

1. The user uploads a PDF file via the FileUploader component on the Home page.
2. The App component's handleFileChange function updates the file state and triggers a navigation to the /file-loaded route, passing along the uploaded file.
3. The PDFRenderer component takes over, receiving the file as part of the route's state. This component then initiates the PDF processing by calling the usePDFProcessing hook.
4. The usePDFProcessing hook leverages pdfjs to parse the uploaded file, extracting text content for further processing.
5. As the text content is being extracted, it is immediately filtered through the filterMachiningReport function to extract relevant parts of the machining report using regular expressions.
6. The extracted parts are then processed further to create an array of "machined pieces". Each piece is an object containing specific attributes like title, startDate, startTime, and totalTime.
7. These machined pieces are then summarized using the summarizePieces function. The summarization includes calculating minimum, maximum, sum, and average of material move times, and determining the start and end times for each title.
8. Finally, the summarized data is used to prepare data for a bar chart representation using the prepareBarChartData function. The final chart displays cut time, material move time, and exceeded move times.

The application includes error handling for unusual cases, such as missing or malformed data within the PDF files. It also ensures that the user interface remains responsive and informative, with a loading bar showing progress and proper navigation routes to guide the user through the process.

In summary, the HSG Laser Tracer provides a streamlined interface and an efficient way of processing PDF data, enabling users to glean insightful analytics and summaries for machined pieces. It highlights the power of modern web technologies in handling complex data processing and visualization tasks.

#### How to Run:
- Clone the repository to your local machine
- Install all necessary dependencies by running npm install or yarn install
- Start the application by running npm start or yarn start

#### Note:
This application is best suited for processing machining reports that follow a specific format. If the input PDFs deviate significantly from the expected format, the output may not be accurate.