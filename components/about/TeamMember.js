export default function TeamMember({ name, role, image }) {
  return (
    <div className="group text-center p-4 transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative mb-6 mx-auto w-48 h-48 overflow-hidden rounded-full shadow-lg ring-4 ring-gray-200 dark:ring-gray-700">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-[200px] h-[200px]"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">{name}</h3>
      <p className="text-md text-gray-600 dark:text-gray-300 mb-3">{role}</p>
      <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full transition-all duration-300 group-hover:w-24"></div>
    </div>
  );
}