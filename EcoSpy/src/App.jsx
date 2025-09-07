import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Aboutus from "./components/aboutUs/aboutUs";
import GetStarted from "./components/getStarted/getStarted";
import Signup from "./components/signUp/signUp";
import PlanChoosing from "./components/planChoose/plan";
import ForgetPass from "./components/ForgetPass/forgetPass";
import DashBoard from "./components/userDashboard/dashBoard";
import Dash from "./components/userDashboard/dash";
import Signupp from "./components/signUp/signup1";
import BulkPlanOrder from "./components/planChoose/bulkplanorder";
import Exp from "./components/userDashboard/exp";
import Num from "./components/userDashboard/number";
import ContactUs from "./components/contactus/contact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/PlanChoosing" element={<PlanChoosing />} />
        <Route path="/forgetpassword" element={<ForgetPass />} />
        <Route path="/dashBoard" element={<Exp/>} />
        <Route path="/bulkplanorder" element={<BulkPlanOrder />} /><Route path="/contactus" element={<ContactUs/>}/>
      </Routes>
    </Router>
  );
}
export default App;
