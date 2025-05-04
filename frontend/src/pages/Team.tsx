import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

interface TeamMember {
  name: string;
  studentNumber: string;
}

interface Team {
  name: string;
  description: string;
  members: TeamMember[];
  advisor: string;
  color: string;
  icon: React.ReactNode;
}

const teams: Team[] = [
  {
    name: 'Computer Engineering',
    description: 'The Computer Engineering team is responsible for developing the robust backend infrastructure, implementing secure API endpoints, and ensuring seamless integration between the frontend and AI components. Their expertise in software architecture and system design has been crucial in creating a scalable and maintainable solution.',
    members: [
      { name: 'Ömer Dursun', studentNumber: '2203452' },
      { name: 'Barış Başaran', studentNumber: '2200198' },
      { name: 'Mehmet Cengizhan Kınay', studentNumber: '2102804' },
    ],
    advisor: 'Dr. Günet Eroğlu',
    color: 'var(--secondary-main)',
    icon: <ComputerIcon />,
  },
  {
    name: 'Artificial Intelligence Engineering',
    description: 'The Artificial Intelligence Engineering team focuses on developing and optimizing the deep learning models for MRI analysis. Their work includes preprocessing medical images, implementing advanced neural network architectures, and ensuring accurate predictions of MGMT methylation status.',
    members: [
      { name: 'Aleyna Benan Aydı', studentNumber: '2003977' },
      { name: 'Deniz Arda Yıldız', studentNumber: '2001247' },
      { name: 'Mert Acar', studentNumber: '2004287' },
    ],
    advisor: 'Dr. Fatih Kahraman',
    color: 'var(--primary-main)',
    icon: <PsychologyIcon />,
  },
];

const Team: React.FC = () => {
  return (
    <Box sx={{ py: 8, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          className="fade-in"
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: 'var(--text-primary)',
          }}
        >
          Our Team
        </Typography>

        <Grid container spacing={6}>
          {teams.map((team, index) => (
            <Grid item xs={12} md={6} key={team.name}>
              <Card
                className="card-hover"
                sx={{
                  height: '100%',
                  borderTop: `4px solid ${team.color}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 20px ${team.color}20`,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: team.color,
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {team.icon}
                    </Avatar>
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        color: team.color,
                        fontWeight: 'bold',
                      }}
                    >
                      {team.name}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {team.description}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: team.color,
                      fontWeight: 'bold',
                    }}
                  >
                    Team Members
                  </Typography>

                  <List>
                    {team.members.map((member) => (
                      <ListItem
                        key={member.studentNumber}
                        sx={{
                          py: 1,
                          '&:hover': {
                            bgcolor: `${team.color}10`,
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemText
                          primary={member.name}
                          secondary={`Student Number: ${member.studentNumber}`}
                          primaryTypographyProps={{
                            sx: { fontWeight: 'medium' },
                          }}
                          secondaryTypographyProps={{
                            sx: { color: 'var(--text-secondary)' },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: `${team.color}10`,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ color: team.color, mr: 1 }} />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: team.color,
                          fontWeight: 'bold',
                        }}
                      >
                        Advisor
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {team.advisor}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Team; 