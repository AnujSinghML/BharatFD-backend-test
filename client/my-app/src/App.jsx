// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import FAQList from './components/FAQList';
// import FAQForm from './components/FAQForm';

// function App() {
//   return (
//     <Router>
//       <div className="container mx-auto p-4">
//         <Routes>
//           <Route path="/" element={<FAQList />} />
//           <Route path="/create" element={<FAQForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FAQList from './components/FAQList';
import FAQForm from './components/FAQForm';
function App() {
return (
<Router>
<Routes>
<Route path="/" element={<FAQList />} />
<Route path="/create" element={<FAQForm />} />
<Route path="/edit/:id" element={<FAQForm />} />
</Routes>
</Router>
);
}
export default App;