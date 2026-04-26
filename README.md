**1. What did you build and why? What did you deliberately cut?**

I built a car recommendation engine to help users by categorizing their needs into different segments and providing personalized car suggestions based on their inputs. The system analyzes user preferences and displays the best matching options accordingly.

It also includes features such as car comparison between multiple selected models and an insights dashboard to understand current market trends and popular choices.

Due to time constraints, I did not implement additional enhancements such as major UI improvements, multiple dedicated pages (like a car details page), or features like saving favorite cars.


**2. What’s your tech stack and why did you pick it?**

I chose Next.js for both frontend and backend because it provides a unified full-stack framework, making it easy to build and integrate both client-side UI and server-side APIs within the same project. It also offers seamless deployment, especially with platforms like Vercel, which makes the deployment process fast and straightforward.

I also used Supabase as the database because it provides a fully managed PostgreSQL backend with built-in authentication, real-time capabilities, and an easy-to-use API layer. It reduces backend complexity and allows faster development while still being scalable and production-ready.


**3. What did you delegate to AI tools vs. do manually? Where did the tools help most?
Where did they get in the way?**

I delegated most of the code implementation to AI tools, and then iteratively refined and fine-tuned the generated output to match the project requirements. The AI assistance significantly accelerated development, making it easier to build and structure a full-stack application through continuous suggestions and code improvements.

However, during debugging, there were instances where the AI repeatedly suggested similar solutions without identifying the root cause of certain issues. For example, it did not initially highlight that Tailwind CSS v4 could be unstable in my setup, which led to multiple configuration issues. I eventually resolved this by switching to a more stable version after troubleshooting.

Overall, AI support played a key role in speeding up development, while manual intervention was necessary for debugging and ensuring stability.


**4. If you had another 4 hours, what would you add?**

If I had an additional 4 hours, I would have expanded the project with several key enhancements to improve both functionality and user experience.

I would have implemented a login system to allow users to securely access personalized features. This would enable storing and retrieving user-specific data such as past search history, making the experience more personalized and contextual over time.

On the UI side, I would have improved the overall design with a more refined interface and added multiple filtering categories to provide better and more accurate car recommendations.

Additionally, I would have introduced data visualization using graphs, derived from user inputs and car dataset trends, to help users better understand comparisons and insights.

A dedicated car details page would have been added to show in-depth specifications, reviews, and comparisons for each vehicle.

Finally, I would have integrated an LLM-based chatbot assistant to help users interact naturally with the system, ask questions, and receive guided recommendations in real time.
