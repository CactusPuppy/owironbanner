var pointToLetter = ['A', 'B', 'C'];
var zoneProgress = `zone${pointToLetter[point]}Progress`;
var result = `
@Rule "Point ${pointToLetter[point]}: Fast Reset"
@Event global
if not huntActive and \
((zoneControl[${point}] == Team.1 and numTeam1${pointToLetter[point]} > 0 and numTeam2${pointToLetter[point]} == 0) or \
(zoneControl[${point}] == Team.2 and numTeam2${pointToLetter[point]} > 0 and numTeam1${pointToLetter[point]} == 0)):
    wait(1, Wait.ABORT_WHEN_FALSE)
    zone${pointToLetter[point]}Progress =  0
    zone${pointToLetter[point]}HudText[3] = "Capturing"
    
@Rule "Point ${pointToLetter[point]}: Gradual Reset"
@Event global
if huntTimer == 0 and \
abs(zone${pointToLetter[point]}Progress) > 0 and numTeam1${pointToLetter[point]} == 0 and numTeam2${pointToLetter[point]} == 0:
    wait(3, Wait.ABORT_WHEN_FALSE)
    chase(zone${pointToLetter[point]}Progress, 0, rate=25, ChaseReeval.NONE)
    zone${pointToLetter[point]}HudText[3] = "Capturing"

@Rule "Point ${pointToLetter[point]}: Contesting"
@Event global
if huntTimer == 0 and numTeam1${pointToLetter[point]} > 0 and numTeam2${pointToLetter[point]} > 0:
    stopChasingVariable(zone${pointToLetter[point]}Progress)
    zone${pointToLetter[point]}HudText[3] ="Contested"
    smallMessage([p for p in getPlayersInRadius(zoneLocations[${point}], zoneSizes[${point}], Team.ALL, LosCheck.OFF) if p.isAlive() and not (p.getCurrentHero() == Hero.SOMBRA and p.isUsingAbility1())], "Contesting!")

@Rule "Point ${pointToLetter[point]}: Capturing"
@Event global
if not huntActive and \
((zoneControl[${point}] != Team.1 and numTeam1${pointToLetter[point]} > 0 and numTeam2${pointToLetter[point]} == 0) or \
(zoneControl[${point}] != Team.2 and numTeam2${pointToLetter[point]} > 0 and numTeam1${pointToLetter[point]} == 0)):
    zone${pointToLetter[point]}HudText[3] = "Capturing"
    if numTeam1${pointToLetter[point]} > 0:
        if zone${pointToLetter[point]}Progress < 0:
            zone${pointToLetter[point]}Progress = 0
        chase(zone${pointToLetter[point]}Progress, 100, rate=5*numTeam1${pointToLetter[point]}, ChaseReeval.DESTINATION_AND_RATE)
    else:
        if zone${pointToLetter[point]}Progress > 0:
            zone${pointToLetter[point]}Progress = 0
        chase(zone${pointToLetter[point]}Progress, -100, rate=5*numTeam2${pointToLetter[point]}, ChaseReeval.DESTINATION_AND_RATE)

@Rule "Point ${pointToLetter[point]}: Listen for Capture"
@Event global
if abs(${zoneProgress}) == 100:
    stopChasingVariable(${zoneProgress})
    zone${pointToLetter[point]}HudText[3] = "Capturing"
    if ${zoneProgress} == 100:
        ${zoneProgress} = 0
        zoneControl[${point}] = Team.1
        addToTeamScore(Team.1, 1)
        smallMessage(getPlayers(Team.1), "Zone ${pointToLetter[point]} Captured")
        smallMessage(getPlayers(Team.2), "Zone ${pointToLetter[point]} Lost")
        playEffect(getAllPlayers(), DynamicEffect.RING_EXPLOSION, Color.TEAM_1, zoneLocations[${point}], zoneSizes[${point}] * 2)
    else:
        ${zoneProgress} = 0
        zoneControl[${point}] = Team.2
        addToTeamScore(Team.2, 1)
        smallMessage(getPlayers(Team.1), "Zone ${pointToLetter[point]} Lost")
        smallMessage(getPlayers(Team.2), "Zone ${pointToLetter[point]} Captured")
        playEffect(getAllPlayers(), DynamicEffect.RING_EXPLOSION, Color.TEAM_2, zoneLocations[${point}], zoneSizes[${point}] * 2)
`;
result;