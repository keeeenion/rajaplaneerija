export const template = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <variables>
    <variable id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</variable>
    <variable id="bbB}|mrA0q51:KX%NAuy">teekond</variable>
    <variable id="]J8J+XtP_(7NQBawzX;M">naabrid</variable>
  </variables>
  <block type="procedures_defreturn" id="sB3DAe@{K~dDeNXvpS_}" deletable="false" editable="false" x="338" y="-12">
    <field name="NAME">leia teekond</field>
    <comment pinned="false" h="80" w="160">Funktsiooni kirjeldus ...</comment>
    <statement name="STACK">
      <block type="variables_set" id="tQ6D}~A5to-6k]sMmKMl">
        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
        <value name="VALUE">
          <block type="start_intersection" id="cq!o#tet)^u?1q3w-QH."></block>
        </value>
        <next>
          <block type="variables_set" id="UZkQF;lm-cHR2yobe,I]">
            <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
            <value name="VALUE">
              <block type="lists_repeat" id="@mC;.s:v,B|ryHeJu,x]">
                <value name="NUM">
                  <shadow type="math_number" id="?bl,Euqb+a09kDJ6tJZ=">
                    <field name="NUM">0</field>
                  </shadow>
                </value>
              </block>
            </value>
            <next>
              <block type="controls_whileUntil" id="?58R18R~RfAK{A8.~6Qc">
                <field name="MODE">UNTIL</field>
                <value name="BOOL">
                  <block type="logic_compare" id="1ULD3Pk~SKM3*N??;WZX">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get" id="Sgk2HN0Yw[jFn{R:%}c5">
                        <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="target_intersection" id="{VgUiHX5F%GTDzS{[]4:"></block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="variables_set" id="0h=Lub@BF]N0Y1if6^8f">
                    <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                    <value name="VALUE">
                      <block type="intersection_neighbors" id="p}W](y](Os*,M31O[+d7">
                        <value name="NODE">
                          <block type="variables_get" id=",9{BiiC7duZZXx.Dw6,N">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="controls_if" id="iT9aI58*u6$pPit,T[_e">
                        <mutation else="1"></mutation>
                        <value name="IF0">
                          <block type="ristmik_in_list" id="!O3hen7x~:3sNXVk:MZ.">
                            <value name="LIST">
                              <block type="variables_get" id="i/^8OG*v#Ar%ds!{|c^i">
                                <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                              </block>
                            </value>
                            <value name="RISTMIK">
                              <block type="target_intersection" id="+8_1UyQ/9g^Ql?FayaPq"></block>
                            </value>
                          </block>
                        </value>
                        <statement name="DO0">
                          <block type="variables_set" id="w;l!-5SJyuO82Li9doQA">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                            <value name="VALUE">
                              <block type="target_intersection" id="L4!2PISU(SK2IBvI,%Rz"></block>
                            </value>
                          </block>
                        </statement>
                        <statement name="ELSE">
                          <block type="variables_set" id="LyL=0Vq~Y5,OKR=x0z,-">
                            <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                            <value name="VALUE">
                              <block type="random_intersection_from_list" id="fW/el,yr{,l7IH5bsTr#">
                                <value name="LIST">
                                  <block type="variables_get" id="eDS;1U=nj5S7)z/5UE~]">
                                    <field name="VAR" id="]J8J+XtP_(7NQBawzX;M">naabrid</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </statement>
                        <next>
                          <block type="lists_setIndex" id="1=6Tr(|1F^VVfI!76F!Q">
                            <mutation at="false"></mutation>
                            <field name="MODE">INSERT</field>
                            <field name="WHERE">LAST</field>
                            <value name="LIST">
                              <block type="variables_get" id="UT%~H-vF.3^VrZ,G6_bq">
                                <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
                              </block>
                            </value>
                            <value name="TO">
                              <block type="variables_get" id="(0TZ9KT$apv,z9uPa..}">
                                <field name="VAR" id="!C2I!mdz!CJ1JOUk8|,,">uuritav ristmik</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
    <value name="RETURN">
      <block type="variables_get" id="R^oLA|pg##GE}E#.sfwD" deletable="false">
        <field name="VAR" id="bbB}|mrA0q51:KX%NAuy">teekond</field>
      </block>
    </value>
  </block>
</xml>
`