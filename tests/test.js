const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { parseDocumentForData } = require('./parse/parse_document_for_data.js');



// Load the content file
const contentScript = fs.readFileSync(path.resolve(__dirname, 'content.js'), 'utf8');

// Create a function to evaluate the content script in a JSDOM environment
function evaluateContentScript(dom) {
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = contentScript;
    dom.window.document.body.appendChild(scriptEl);
}

// Mock the chrome.runtime.onMessage.addListener function
global.chrome = {
    runtime: {
        onMessage: {
            addListener: jest.fn()
        }
    }
};

describe('parseDocumentForData', () => {
    let dom;

    beforeEach(() => {
        // Create a new JSDOM instance with a sample HTML
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <p>Sample text before input</p>
                <input id="input1" placeholder="Enter text here">
                <p>Sample text before select</p>
                <select id="select1">
                    <option>Option 1</option>
                    <option>Option 2</option>
                </select>
            </body>
            </html>
        `);

        // Evaluate the content script in the JSDOM environment
        evaluateContentScript(dom);
    });

    test('should retrieve page content and input fields', () => {
        const result = parseDocumentForData(dom.window.document);
        expect(result).toEqual({
            page_content: 'Sample text before input\nSample text before select\nOption 1\nOption 2',
            inputs: [
                {
                    element_id: 'input1',
                    hint: 'Enter text here',
                    description: 'Sample text before input',
                    options: []
                },
                {
                    element_id: 'select1',
                    hint: null,
                    description: 'Sample text before select',
                    options: ['Option 1', 'Option 2']
                }
            ]
        });
    });


    test('should retrieve page content and input fields of example_page', () => {
        let example_page = fs.readFileSync(path.resolve(__dirname, 'example_page.html'), 'utf8');
        let exampleJSDOM = new JSDOM(example_page);


        let expectedInputs = [
            "First Name *",
            "Last Name *",
            "Email *",
            "Phone",
            "School",
            "Degree",
            "Discipline",
            "During this application process I agree to use only my own words. I understand that plagiarism, the use of AI or other generated content will disqualify my application. *",
            "Describe your involvement in a production project which you are particularly proud of or contribution to a web framework? *",
            "Describe your experience with JavaScript, TypeScript and Flutter *",
            "How did you perform in mathematics at high school? *",
            "How did you perform in your native language at high school? *",
            "Please share your rationale or evidence for the high school performance selections above. Make reference to provincial, state or nation-wide scoring systems, rankings, or recognition awards, or to competitive or selective college entrance results such as SAT or ACT scores, JAMB, matriculation results, IB results etc. We recognise every system is different but we will ask you to justify your selections above. *",
            "What was your bachelor's university degree result, or expected result if you have not yet graduated? *\n" +
            ' Please indicate your result, or expected result if you are close to graduation.',
            'Select the grading system to help us understand your result *\n' +
            ' Universities around the world score degrees in different ways.',
            'If you selected None of the above in the previous question, please describe how your university grading system works and country of graduation.\n' +
            ' Please specify the university grading system you were graded with.',
            'We expect all colleagues to meet in person 2-4 times a year, at internal company events lasting between 1-2 weeks. We try to pick new and interesting locations that will likely require international travel and entry requirement visas and vaccinations. Are you willing and able to commit to this? *\n' +
            ' Please note that if you require any accommodation for travel that relates to a physical disability please do let us know during your hiring process and we will be happy to discuss your requirements further.',
            "Website",
            "LinkedIn Profile",
            "Github",
            "Please confirm that you have read and agree to Canonical's Recruitment Privacy Notice and Privacy Policy. *\n" +
            ' Recruitment Privacy Notice Privacy Policy',
            'In which country do you currently work? *\n' +
            '  \n' +
            ' Please select your current location from the dropdown.'
        ]
        let processor = require('./parse/domain_rules/greenhouse.io.js');
        let result = processor.parseDocumentForData(exampleJSDOM.window.document);
        // console.log("result of processor.parseDocumentForData(exampleJSDOM.window.document):");
        // console.log(result);
        // console.log("end of result of processor.parseDocumentForData(exampleJSDOM.window.document)");
        const resultDescriptions = result.inputs.map(input => input.description);
        expect(resultDescriptions).toEqual(expectedInputs);
    });
});