// // components/RichTextEditor.js
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// export default function RichTextEditor({ value, onChange, disabled }) {
//     console.log("RichTextEditor rendered"); // Add this line
//     return (
//         <CKEditor
//             editor={ClassicEditor}
//             data={value}
//             disabled={disabled}
//             onChange={(event, editor) => {
//                 const data = editor.getData();
//                 onChange(data);
//             }}
//             config={{
//                 toolbar: [
//                     'undo', 'redo', '|',
//                     'heading', '|',
//                     'bold', 'italic', 'underline', '|',
//                     'link', 'bulletedList', 'numberedList', '|',
//                     'blockQuote', 'codeBlock', '|',
//                     'alignment', 'removeFormat'
//                 ]
//             }}
//         />
//     );
// }