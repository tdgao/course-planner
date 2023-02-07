import { Typography, Button, Autocomplete } from "@mui/joy";
import { atom, useAtom } from "jotai";
import { addCourseAtom, courseObjType } from "../ProgramPlannerAtoms";
import coursesJson from "../../assets/courses.json";

const coursesToAddAtom = atom<courseObjType[]>([]);
const courseOptionsAtom = atom<courseObjType[]>([]);
const courses = Object.values(coursesJson);
const coursePrefixes: string[] = [
  ...new Set(courses.map((course) => toPrefix(course.courseId))),
]; // ENGR, MATH, etc... creating a set makes unique items

let courseOptionsMap: Record<string, courseObjType[]> = {};
coursePrefixes.forEach((prefix) => {
  courseOptionsMap[prefix] = courses.filter(
    (course) => prefix === toPrefix(course.courseId)
  );
});

const handleSetOptions = (
  input: string,
  setCourseOptions: (options: courseObjType[]) => void
) => {
  const inputPrefix = toPrefix(input.toUpperCase());
  if (coursePrefixes.includes(inputPrefix))
    setCourseOptions(courseOptionsMap[inputPrefix]);
  else if (inputPrefix === "") setCourseOptions([]);
};

const addCourses = (
  addCourse: (courseId: string) => void,
  coursesToAdd: courseObjType[]
) => {
  coursesToAdd.forEach((course) => {
    addCourse(course.courseId);
  });
};

export const AddCoursesInput = () => {
  const [, addCourse] = useAtom(addCourseAtom);
  const [coursesToAdd, setCoursesToAdd] = useAtom(coursesToAddAtom);
  const [courseOptions, setCourseOptions] = useAtom(courseOptionsAtom);

  return (
    <>
      <Typography level="subHeading">Add single courses</Typography>
      <Autocomplete
        placeholder="Add courses"
        noOptionsText="Search courses, e.g MATH101"
        size="sm"
        multiple
        value={coursesToAdd}
        options={courseOptions}
        getOptionLabel={(option) => option.courseId}
        onInputChange={(e, inputVal) => {
          handleSetOptions(inputVal, setCourseOptions);
        }}
        onChange={(e, newValue) => {
          newValue && setCoursesToAdd(newValue);
        }}
      />
      <Button
        size="sm"
        variant="soft"
        color={coursesToAdd.length > 0 ? "primary" : "neutral"}
        style={{ width: "max-content" }}
        onClick={() => {
          addCourses(addCourse, coursesToAdd);
          setCoursesToAdd([]);
        }}
      >
        Add courses
      </Button>
    </>
  );
};

function toPrefix(courseId: string) {
  return courseId.replace(/\d+/g, "");
}
