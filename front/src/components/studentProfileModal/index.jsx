import React from "react";
import { useStudentProfile } from "./useStudentProfile";
import StudentProfileModalUI from "./StudentProfileModalUI";

export default function StudentProfileModal(props) {
  const profileLogic = useStudentProfile(props);

  return <StudentProfileModalUI {...props} {...profileLogic} />;
}