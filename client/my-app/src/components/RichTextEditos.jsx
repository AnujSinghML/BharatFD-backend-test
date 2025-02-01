import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PropTypes from 'prop-types';

export default function RichTextEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_, editor) => onChange(editor.getData())}
      config={{
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
      }}
    />
  );
}
// Declare PropTypes for the component
RichTextEditor.propTypes = {
    value: PropTypes.string.isRequired, // this prop should be a string
    onChange: PropTypes.func.isRequired, // onChange should be a function
    };