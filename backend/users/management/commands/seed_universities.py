from django.core.management.base import BaseCommand
from users.models import University

class Command(BaseCommand):
    help = "Seeds top Indian universities and their official student email domains into Tibbit"

    def handle(self, *args, **options):
        universities = [
            # Delhi NCR
            {
                "name": "Manav Rachna International Institute of Research and Studies",
                "email_domain": "manavrachna.net",
                "location": "Faridabad, Haryana",
            },
            {
                "name": "Delhi University",
                "email_domain": "du.ac.in",
                "location": "New Delhi, Delhi",
            },
            {
                "name": "Indian Institute of Technology Delhi",
                "email_domain": "iitd.ac.in",
                "location": "Hauz Khas, New Delhi",
            },
            {
                "name": "Delhi Technological University",
                "email_domain": "dtu.ac.in",
                "location": "Rohini, New Delhi",
            },
            {
                "name": "Netaji Subhas University of Technology",
                "email_domain": "nsut.ac.in",
                "location": "Dwarka, New Delhi",
            },
            {
                "name": "Indraprastha Institute of Information Technology Delhi",
                "email_domain": "iiitd.ac.in",
                "location": "Okhla, New Delhi",
            },
            {
                "name": "Jawaharlal Nehru University",
                "email_domain": "jnu.ac.in",
                "location": "New Delhi, Delhi",
            },
            {
                "name": "Ashoka University",
                "email_domain": "ashoka.edu.in",
                "location": "Sonipat, Haryana",
            },
            {
                "name": "O.P. Jindal Global University",
                "email_domain": "jgu.edu.in",
                "location": "Sonipat, Haryana",
            },
            {
                "name": "Shiv Nadar University",
                "email_domain": "snu.edu.in",
                "location": "Greater Noida, UP",
            },
            {
                "name": "Amity University Noida",
                "email_domain": "amity.edu",
                "location": "Noida, UP",
            },
            {
                "name": "Bennett University",
                "email_domain": "bennett.edu.in",
                "location": "Greater Noida, UP",
            },

            # Premier Tech & Science Institutes (IITs & BITS)
            {
                "name": "Indian Institute of Technology Bombay",
                "email_domain": "iitb.ac.in",
                "location": "Powai, Mumbai",
            },
            {
                "name": "Indian Institute of Technology Madras",
                "email_domain": "iitm.ac.in",
                "location": "Chennai, Tamil Nadu",
            },
            {
                "name": "Indian Institute of Technology Kanpur",
                "email_domain": "iitk.ac.in",
                "location": "Kanpur, UP",
            },
            {
                "name": "Indian Institute of Technology Kharagpur",
                "email_domain": "iitkgp.ac.in",
                "location": "Kharagpur, West Bengal",
            },
            {
                "name": "Indian Institute of Technology Roorkee",
                "email_domain": "iitr.ac.in",
                "location": "Roorkee, Uttarakhand",
            },
            {
                "name": "Indian Institute of Technology Guwahati",
                "email_domain": "iitg.ac.in",
                "location": "Guwahati, Assam",
            },
            {
                "name": "BITS Pilani (Pilani Campus)",
                "email_domain": "pilani.bits-pilani.ac.in",
                "location": "Pilani, Rajasthan",
            },
            {
                "name": "BITS Pilani (Goa Campus)",
                "email_domain": "goa.bits-pilani.ac.in",
                "location": "Zuarinagar, Goa",
            },
            {
                "name": "BITS Pilani (Hyderabad Campus)",
                "email_domain": "hyderabad.bits-pilani.ac.in",
                "location": "Jawahar Nagar, Hyderabad",
            },
            {
                "name": "Indian Institute of Science Bangalore",
                "email_domain": "iisc.ac.in",
                "location": "Bengaluru, Karnataka",
            },

            # Premier Management & Law Institutes
            {
                "name": "Indian Institute of Management Ahmedabad",
                "email_domain": "iima.ac.in",
                "location": "Ahmedabad, Gujarat",
            },
            {
                "name": "Indian Institute of Management Bangalore",
                "email_domain": "iimb.ac.in",
                "location": "Bengaluru, Karnataka",
            },
            {
                "name": "Indian Institute of Management Calcutta",
                "email_domain": "iimcal.ac.in",
                "location": "Kolkata, West Bengal",
            },
            {
                "name": "National Law School of India University",
                "email_domain": "nls.ac.in",
                "location": "Bengaluru, Karnataka",
            },
            {
                "name": "National Law University Delhi",
                "email_domain": "nludelhi.ac.in",
                "location": "Dwarka, New Delhi",
            },

            # Premier Private & Regional Universities
            {
                "name": "Vellore Institute of Technology",
                "email_domain": "vitstudent.ac.in",
                "location": "Vellore, Tamil Nadu",
            },
            {
                "name": "SRM Institute of Science and Technology",
                "email_domain": "srmist.edu.in",
                "location": "Kattankulathur, Chennai",
            },
            {
                "name": "Manipal Academy of Higher Education",
                "email_domain": "learner.manipal.edu",
                "location": "Manipal, Karnataka",
            },
            {
                "name": "Thapar Institute of Engineering and Technology",
                "email_domain": "thapar.edu",
                "location": "Patiala, Punjab",
            },
            {
                "name": "Plaksha University",
                "email_domain": "plaksha.edu.in",
                "location": "Mohali, Punjab",
            },
            {
                "name": "Krea University",
                "email_domain": "krea.edu.in",
                "location": "Sri City, Andhra Pradesh",
            },
        ]

        count = 0
        for uni in universities:
            obj, created = University.objects.update_or_create(
                email_domain=uni["email_domain"],
                defaults={
                    "name": uni["name"],
                    "location": uni.get("location", ""),
                    "is_active": True,
                    "is_verified": True,
                }
            )
            count += 1
            status_tag = "CREATED" if created else "UPDATED"
            self.stdout.write(f"[{status_tag}] {obj.name} (@{obj.email_domain})")

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully synced {count} universities!"))
