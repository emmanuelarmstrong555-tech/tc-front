import React from "react";

export default function ReviewSelectionModal({ 
  isOpen, 
  onClose, 
  selectedCourses, 
  selectedSubjects, 
  subjectsByCourse,
  onEdit, 
  onContinue 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-8 md:p-10 border border-white/20 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        
        <div className="mb-8 shrink-0">
          <h2 className="text-2xl font-black text-[#09314F] uppercase tracking-tight">Review</h2>
          <p className="text-gray-400 text-xs font-bold mt-1 tracking-wide">Review your selected courses and subjects</p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-[140px_1fr] bg-[#09314F] text-white px-8 py-4 rounded-t-3xl">
            <span className="text-[10px] font-black uppercase tracking-widest px-2">Courses</span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2">Subjects</span>
          </div>

          <div className="bg-white border-x border-b border-gray-100 rounded-b-3xl divide-y divide-gray-50 overflow-hidden shadow-sm mb-10">
            {selectedCourses.map((course) => {
              const subjects = subjectsByCourse[course.id]?.filter((s) => selectedSubjects[course.id]?.includes(s.id)) || [];
              return (
                <div key={course.id} className="grid grid-cols-[140px_1fr] items-start px-8 py-6">
                  <div className="text-sm font-black text-[#09314F] uppercase tracking-tight leading-none px-2 mt-1">
                    {course.title}
                  </div>
                  <div className="px-4 flex flex-wrap gap-2">
                    {subjects.length > 0 ? (
                      subjects.map((s) => (
                        <span key={s.id} className="inline-block text-[13px] font-bold text-gray-500 after:content-[','] last:after:content-[''] mr-1">
                          {s.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-300 italic text-xs">No subjects selected</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 mt-8 shrink-0">
          <button 
            onClick={onEdit} 
            className="flex-1 py-4 px-6 rounded-2xl font-black text-[#09314F] bg-white border-2 border-[#09314F11] hover:bg-gray-50 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
          >
            Edit
          </button>
          <button 
            onClick={onContinue} 
            className="flex-[1.5] py-4 px-6 rounded-2xl font-black text-white bg-[#09314F] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] uppercase tracking-widest text-[11px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
