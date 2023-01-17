import { useAtom } from "jotai";
import { useEffect } from "react";
import { maxCoursesFamily, setScheduleAtom } from "./useProgramSchedule";

interface MaxCoursesInputProps {
  id: string;
}

export const MaxCoursesInput = (props: MaxCoursesInputProps) => {
  const { id } = props;
  const [maxCourses, setMaxCourses] = useAtom(maxCoursesFamily({ id: id }));

  const [, setSchedule] = useAtom(setScheduleAtom);
  useEffect(() => {
    setSchedule();
  }, [maxCourses]);

  const handleOnChange = (e: any) => {
    const val = parseInt(e.target.value);
    val >= 0 && setMaxCourses({ ...maxCourses, value: val });
  };

  return (
    <input
      type="number"
      data-term={maxCourses.term}
      value={maxCourses.value}
      onChange={handleOnChange}
    />
  );
};
