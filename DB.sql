-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Win64 (AMD64)
--
-- Host: comp4537s2.mysql.database.azure.com    Database: s2projectdb
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `choice1` varchar(255) NOT NULL,
  `choice2` varchar(255) NOT NULL,
  `choice3` varchar(255) DEFAULT NULL,
  `choice4` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `answer` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (181,'What is the result of <pre class=\'block\'>0.1 + 0.2 === 0.3</pre> in JavaScript?','true','false','undefined','null','JavaScript',2),(182,'Which of the following will return false?','<pre class=\'block\'>\'\' == false</pre>','<pre class=\'block\'>NaN == NaN</pre>','<pre class=\'block\'>false === false</pre>','<pre class=\'block\'>null == undefined</pre>','JavaScript',2),(183,'What does <pre class=\'block\'>typeof typeof(null)</pre> return?','Object','undefined','String','None of the above','JavaScript',3),(184,'What does <pre class=\'block\'>typeof(() =&gt; undefined)</pre> return?','Object','Function','undefined','null','JavaScript',2),(185,'What will <pre class=\'block\'>console.log(!!{})</pre> return in console?','undefined','!!{}','true','false','JavaScript',3),(186,'Which of the following will return true?','<pre class=\'block\'>Object.isArray([])</pre>','<pre class=\'block\'>Array.isArray([])</pre>','<pre class=\'block\'>typeof [] === \'array\'</pre>','<pre class=\'block\'>isArray([])</pre>','JavaScript',2),(187,'How many threads does JavaScript code run in?','8','2','no set number','1','JavaScript',4),(188,'How do you create an object in JavaScript that has no prototype?','<pre class=\'block\'>Object.create(undefined)</pre>','<pre class=\'block\'>new Object(undefined)</pre>','<pre class=\'block\'>Object.create(null)</pre>','<pre class=\'block\'>new Object(null)</pre>','JavaScript',3),(189,'In JavaScript, which method returns a new array based on the results of running a specified function on each element in the original array?','map','reduce','forEach','transform','JavaScript',1),(190,'What is the result of <pre class=\'block\'>100 / 0</pre> in JavaScript','NaN','It throws an error','0','Infinity','JavaScript',4),(191,'Which of the following is not a void element in HTML?','br','img','iframe','hr','HTML',3),(192,'Which is incorrect regarding global attributes in HTML?','There are only 3 global attributes: id, class, and style','Global attributes can be used with all HTML elements','An HTML element can have the same name for an id and a class','Global attributes do not have broad support across browsers','HTML',1),(193,'Which HTML element is used to display a scalar measurement within a range?','<pre class=\'block\'>&lt;range&gt;</pre>','<pre class=\'block\'>&lt;meter&gt;</pre>','<pre class=\'block\'>&lt;gauge&gt;</pre>','<pre class=\'block\'>&lt;measure&gt;</pre>','HTML',2),(194,'Text within <pre class=\'block\'>&lt;em&gt; … &lt;/em&gt;</pre> tags is displayed as ________','bold text','indented text','list text','italic text','HTML',4),(195,'What is the correct HTML for making a text area?','<pre class=\'block\'>&lt;input type=\'textbox\' /&gt;</pre>','<pre class=\'block\'>&lt;input type=\'textarea\' /&gt;</pre>','<pre class=\'block\'>&lt;textarea&gt;</pre>','<pre class=\'block\'>&lt;textbox&gt;</pre>','HTML',3),(196,'How many different heading sizes are there in HTML?','5','3','7','6','HTML',4),(197,'Which of the following is NOT true about a script loaded with the defer attribute?','It executes scripts in order','It downloads asynchronously while the DOM is being parsed','It executes after DOMContentLoaded','It can only be used on external scripts','HTML',3),(198,'Which of the following is NOT a real tag in HTML?','<pre class=\'block\'>&lt;ins&gt;</pre>','<pre class=\'block\'>&lt;del&gt;</pre>','<pre class=\'block\'>&lt;wbr&gt;</pre>','<pre class=\'block\'>&lt;field&gt;</pre>','HTML',4),(199,'Which of the following is false about the canvas tag in HTML','Canvas tags can be used to draw on HTML pages without the use of JavaScript','Canvas tags are transparent and are a container used to draw graphics','Text inside the canvas element will be displayed in browsers if JavaScript is disabled or if that browser does not support canvas ','The only default CSS values of a canvas is its width and height','HTML',1),(200,'To get a link to open in a new window or tab, use the ______ attribute value','_blank','_self','_new','_parent','HTML',1),(201,'If you apply margin on an inline element, which sides will it apply to?','Only left and right','Only top and bottom','All sides','No sides','CSS',1),(202,'Which of these is true about visibility: hidden in CSS?','It occupies space','It is removed from the DOM','It can still be clicked on','It is the same as opacity: 0','CSS',1),(203,'In what order are margin and padding defined in CSS?','Right, Bottom, Left, Top','Top, Bottom, Left, Right','Top, Right, Bottom, Left','Left, Right, Top, Bottom','CSS',3),(204,'What is the order of the box model from the inside out in CSS?','Content, Padding, Border, Margin','Content, Margin, Border, Padding','Content, Border, Padding, Margin','Padding, Content, Border, Margin','CSS',1),(205,'If you want to fill an entire background with an image without distorting the aspect ratio, which value of background-size do you use?','cover','fill','100%','contain','CSS',1),(206,'How do you define a custom property in CSS?','$custom-property = 10','$custom-property: 10','--custom-property = 10','--custom-property: 10','CSS',4),(207,'Which CSS unit is the largest?','px','mm','pc','Q','CSS',3),(208,'How do you access the value of a data-attribute in CSS?','color: data(data-color);','content: data(data-text);','color: attr(data-color);','content: attr(data-text);','CSS',2),(209,'Which of the following is not a valid CSS property?','border-image','empty-cells','text-wrap','will-change','CSS',3),(210,'Which CSS selector is the most specific?','a#id .red:first-child','#id &gt; .red:not(li)','a.green.bold.wide','#id.small.red','CSS',1),(211,'What will happen if you run the command \'init 1\' in your terminal','Reboot the system','Shut down the system','Enter single user mode','Start the system without a display manager (GUI)','Linux',3),(212,'What does the command \'top\' show?','The space usage','The memory usage','The active processes and their corresponding information','Nothing, it\'s not a command','Linux',3),(213,'What is the pipe character in Linux?','|','*','-','&gt;','Linux',1),(214,'A low-level utility used for creating/restoring filesystem backup copies in Linux is called:','fsutil','diskpart','dd','format','Linux',3),(215,'Which command can be used to count characters in a text file in Linux?','ccount','fsize','count','wc','Linux',2),(216,'What happens when you use the \'kill %s\' command?','System processes will be stopped','All jobs with command beginning with ‘s’ will be terminated','The last job with \'s\' will be terminated','The first job with \'s\' will be terminated','Linux',2),(217,'When do we use the GREP command','When we want to search for a string','To find a file','To find a directory','To show all directories which have the string in their name','Linux',1),(218,'Choose the correct usage of ‘cd’ to move into the parent directory','cd','cd ..','cd .','cd /','Linux',2),(219,'Which command can be used to rename a file/directory?','mv','cp','rename','rm','Linux',1),(220,'Which command is used to delete a directory in Linux?','ls','delete','remove','rmdir','Linux',4),(221,'How do you list all running Docker containers?','$ -docker ps','$ docker --ps','$ docker ps','$ docker ps -a','Docker',3),(222,'What is the hard limit for the number of containers that you can run simultaneously?','2','3','5','There is no hard limit','Docker',4),(223,'What is the name of the enterprise-grade cluster management solution from Docker?','Docker Swarm','Docker Hub','Docker Web UI','Docker Universal Control Plane','Docker',4),(224,'What is the docker command to show all images?','$ docker images','$ docker imgs','$ docker images - a','$ docker image','Docker',1),(225,'What is the docker command to remove all networks, images, and stopped containers?','$ docker prune','$ docker system prune','$ docker kill','$ docker kill --all','Docker',2),(226,'Docker registry defaults to listening on which port?','3000','5000','8000','1433','Docker',2),(227,'How many private repositories are allowed for an individual on Docker Hub','1','2','4','There is no set amount','Docker',1),(228,'Which text document contains all the commands a user could call on the command line to assemble an image?','Docker Cloud','Dockerfile','Docker Compose','Docker Kitematic','Docker',2),(229,'A docker registry is a place to store and distribute Docker ______','Files','Containers','Images','All of the Above','Docker',3),(230,'What is the markup language used to write Docker configuration files?','JSON','YAML','XML','HTML','Docker',2),(231,'Which function converts an integer, x, to a unicode character in Python?','<pre class=\'block\'>unichr(x)</pre>','<pre class=\'block\'>ord(x)</pre>','<pre class=\'block\'>uni(x)</pre>','<pre class=\'block\'>oct(x)</pre>','Python',4),(232,'All keywords in Python are','Uppercase','Lowercase','Capitalized','None of the above','Python',4),(233,'Which of the following is NOT a keyword in Python?','pass','assert','nonlocal','eval','Python',4),(234,'How many Binary Data Types exist in Python?','1','2','3','None','Python',3),(235,'What will be the value of the following Python expression: <pre class=\'block\'>4 + 3 % 5</pre>','7','2','4','1','Python',1),(236,'Which of the following is the truncation division operator in Python?','|','/','//','%','Python',3),(237,'What is the maximum possible length of an identifier in Python?','31 characters','128 characters','63 characters','None of the above','Python',4),(238,'Which of the following declarations is incorrect?','<pre class=\'block\'>_x = 2</pre>','<pre class=\'block\'>__x = 3</pre>','<pre class=\'block\'>__xyz__ = 5</pre>','None of the above','Python',4),(239,'Which of the following keywords is used in Python for file streaming','try','with','import','from','Python',2),(240,'What if statement is used in Python to only run code if a file was run directly?','<pre class=\'block\'>if __name__ == \'__main__\'</pre>','<pre class=\'block\'>if _name_ == \'_main_\'</pre>','<pre class=\'block\'>if __name__ == \'main\'</pre>','None of the above','Python',1);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `score` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(20) NOT NULL,
  `highscore` varchar(5) NOT NULL,
  `category` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
INSERT INTO `score` VALUES (12,'89d8ab9d-2ac8-458c-a123-44efcf490af8','Alk','100','JavaScript'),(50,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(51,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(52,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(53,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(54,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(55,'a9111694-c240-4c9f-bcfb-6617dd51c552','a','1000','Linux'),(56,'a9111694-c240-4c9f-bcfb-6617dd51c552','af','1000','Linux'),(57,'a9111694-c240-4c9f-bcfb-6617dd51c552','aff','1000','Linux'),(58,'a9111694-c240-4c9f-bcfb-6617dd51c552','afff','1000','Linux'),(59,'a9111694-c240-4c9f-bcfb-6617dd51c552','affff','1000','Linux'),(61,'256a2ca6-872f-4462-b303-fd4d9b809e10','test','400','JavaScript'),(62,'e435d2ea-dd5c-44be-b86b-2fd643d0ffb7','Alkarim','300','JavaScript'),(63,'e435d2ea-dd5c-44be-b86b-2fd643d0ffb7','JSTest','200','JavaScript'),(64,'e69b7793-5af0-4bb7-a2b3-f953ad3cdcc7','testLOL','0','JavaScript'),(67,'560a559e-7c20-4e6a-9d43-80e0ec3a4f59','Alkarimm','100','CSS');
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$10$7hiUIvhJSc71ieCvhyYoMOSYL7HLpANYJrE6m4XDcfhZGguW8vzeC'),(2,'admin','$2b$10$agTtn1zu.cc3qMy2C42Zd.utmCzX9V1Pkb9ObDnrE5v1mXkdHssk6'),(3,'admin','$2b$10$MAFMZWvCRZLHdoq30KRZLONh5gv6bEBBiXrKUNOJZyk67rgDj/6iy');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-28 22:49:48
