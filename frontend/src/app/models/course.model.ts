export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  completionStatus: 'Not Started' | 'In Progress' | 'Completed';
  syllabus: string[];
  objectives: string[];
  prerequisites: string[];
  description: string;
  imageUrl?: string;
  availability: 'Available' | 'Upcoming' | 'Closed';
}
