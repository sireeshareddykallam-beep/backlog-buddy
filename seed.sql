-- Sample catalog content for Backlog Buddy
insert into public.universities(name,code,region) values
('Jawaharlal Nehru Technological University Kakinada','JNTUK','Andhra Pradesh'),
('Jawaharlal Nehru Technological University Hyderabad','JNTUH','Telangana'),
('Andhra University','AU','Andhra Pradesh');
insert into public.courses(name,code) values ('Bachelor of Technology','BTECH'),('Bachelor of Engineering','BE');
insert into public.branches(course_id,name,code) select id,'Computer Science and Engineering','CSE' from public.courses where code='BTECH';
insert into public.branches(course_id,name,code) select id,'Electronics and Communication Engineering','ECE' from public.courses where code='BTECH';
insert into public.branches(course_id,name,code) select id,'Electrical and Electronics Engineering','EEE' from public.courses where code='BTECH';
insert into public.branches(course_id,name,code) select id,'Mechanical Engineering','MECH' from public.courses where code='BTECH';
insert into public.branches(course_id,name,code) select id,'Civil Engineering','CIVIL' from public.courses where code='BTECH';
insert into public.regulations(university_id,code,effective_year) select id,r.code,r.yr from public.universities cross join (values('R20',2020),('R21',2021),('R22',2022),('R23',2023),('R24',2024)) r(code,yr);
insert into public.semesters(year_no,semester_no,label) values (1,1,'I-I'),(1,2,'I-II'),(2,1,'II-I'),(2,2,'II-II'),(3,1,'III-I'),(3,2,'III-II'),(4,1,'IV-I'),(4,2,'IV-II');

insert into public.subjects(university_id,branch_id,regulation_id,semester_id,code,name,description)
select u.id,b.id,r.id,s.id,v.code,v.name,v.description from public.universities u join public.branches b on b.code='CSE' join public.regulations r on r.university_id=u.id and r.code='R23' join public.semesters s on s.label='II-II'
cross join (values
('CS2203','Database Management Systems','Relational models, SQL, normalization and transactions.'),
('CS2202','Operating Systems','Processes, memory management, file systems and deadlocks.'),
('CS3101','Computer Networks','Network layers, protocols, routing and security.'),
('CS1204','Data Structures & Algorithms','Trees, graphs, sorting and complexity analysis.')
) v(code,name,description) where u.code='JNTUK';

insert into public.units(subject_id,unit_no,title,topics)
select s.id,v.n,v.title,v.topics::jsonb from public.subjects s cross join (values
(1,'Introduction and ER Model','["DBMS architecture","ER diagrams","Data independence"]'),
(2,'Relational Algebra and SQL','["Relational algebra","SQL joins","Nested queries"]'),
(3,'Normalization','["Functional dependencies","2NF","3NF","BCNF"]'),
(4,'Transactions','["ACID","Concurrency control","Recovery"]'),
(5,'Indexing and Storage','["B+ trees","Hashing","File organization"]')) v(n,title,topics) where s.code='CS2203';

insert into public.questions(subject_id,unit_id,body,answer,question_type,marks,difficulty,is_important,occurrence_count,source_note,status)
select s.id,u.id,v.body,v.answer,v.kind::public.question_kind,v.marks,v.difficulty,true,v.count,'Frequently appeared in available institution-provided papers.','published'
from public.subjects s join public.units u on u.subject_id=s.id cross join (values
(1,'Explain three-schema architecture and data independence.','The three levels are external, conceptual and internal. Data independence allows changes at one level without requiring changes at higher levels.','long',10,'medium',3),
(3,'Which normal form removes partial dependency on a composite candidate key?','Second Normal Form (2NF).','mcq',2,'easy',4),
(3,'Explain functional dependencies and normalization up to BCNF.','Describe 1NF, 2NF, 3NF and BCNF with suitable decomposition examples.','long',10,'hard',5),
(4,'State the ACID properties of a transaction.','Atomicity, Consistency, Isolation and Durability.','short',5,'easy',4)
) v(unit_no,body,answer,kind,marks,difficulty,count) where s.code='CS2203' and u.unit_no=v.unit_no;

insert into public.question_options(question_id,body,is_correct,explanation)
select q.id,v.body,v.correct,'2NF removes partial dependencies of non-prime attributes on part of a composite candidate key.' from public.questions q cross join (values('First Normal Form (1NF)',false),('Second Normal Form (2NF)',true),('Third Normal Form (3NF)',false),('Boyce-Codd Normal Form',false)) v(body,correct) where q.body like 'Which normal form%';
