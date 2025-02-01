import PropTypes from 'prop-types';

function RichTextEditor({ value, onChange }) {
  return (
    <textarea
      className="w-full p-2 border rounded min-h-[150px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RichTextEditor;