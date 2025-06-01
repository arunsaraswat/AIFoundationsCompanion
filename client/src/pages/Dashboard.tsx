import { useCourseProgress } from "../contexts/CourseProgressContext";
import ProgressBar from "../components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, Target } from "lucide-react";

export default function Dashboard() {
  const { lessons, getOverallProgress, getLessonProgress } = useCourseProgress();
  const overallProgress = getOverallProgress();

  const completedLessons = lessons.filter(lesson => {
    const progress = getLessonProgress(lesson.id);
    return progress.isCompleted;
  }).length;

  const inProgressLessons = lessons.filter(lesson => {
    const progress = getLessonProgress(lesson.id);
    return progress.completed > 0 && !progress.isCompleted;
  }).length;

  const totalExercises = lessons.reduce((total, lesson) => {
    return total + lesson.subLessons.reduce((subTotal, subLesson) => {
      return subTotal + (subLesson.exercises?.length || 0);
    }, 0);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Course Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Track your progress through the AI-Native Foundations course
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <ProgressBar {...overallProgress} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
            <p className="text-xs text-muted-foreground">
              out of {lessons.length} lessons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressLessons}</div>
            <p className="text-xs text-muted-foreground">
              lessons started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
            <p className="text-xs text-muted-foreground">
              interactive exercises
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              overall completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Overview */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Lesson Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => {
            const progress = getLessonProgress(lesson.id);
            const getStatusBadge = () => {
              if (progress.isCompleted) {
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Completed</Badge>;
              } else if (progress.completed > 0) {
                return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">In Progress</Badge>;
              } else {
                return <Badge variant="outline">Not Started</Badge>;
              }
            };

            return (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Lesson {lesson.id}: {lesson.title}
                    </CardTitle>
                    {getStatusBadge()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sub-lessons completed</span>
                      <span>{progress.completed} / {progress.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lesson.subLessons.length} sub-lessons available
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}